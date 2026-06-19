const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const sourceRoot = path.join(repoRoot, 'schema', 'kirby5')
const outputPath = path.join(repoRoot, 'kirby5-blueprints.schema.json')

function readJson(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(sourceRoot, relativePath), 'utf8'))
}

function schemaRef(group, name) {
    return {
        $ref: `#/$defs/${group}/${name}`,
    }
}

function schemaRefs(group, names) {
    return names.map((name) => schemaRef(group, name))
}

function orderedObject(order, values, label) {
    const result = {}

    for (const name of order) {
        if (!Object.prototype.hasOwnProperty.call(values, name)) {
            throw new Error(`Missing ${label} entry: ${name}`)
        }

        result[name] = values[name]
    }

    const extra = Object.keys(values).filter((name) => !order.includes(name))

    if (extra.length > 0) {
        throw new Error(`Unexpected ${label} entries: ${extra.join(', ')}`)
    }

    return result
}

function loadDefinitionMap(paths) {
    const definitions = {}

    for (const relativePath of paths) {
        const source = readJson(relativePath)

        for (const [name, definition] of Object.entries(source)) {
            if (Object.prototype.hasOwnProperty.call(definitions, name)) {
                throw new Error(`Duplicate definition entry: ${name}`)
            }

            definitions[name] = definition
        }
    }

    return definitions
}

function loadDefinitionFiles(group, names) {
    const directory = path.join(sourceRoot, 'defs', group)
    const sourceNames = fs
        .readdirSync(directory)
        .filter((file) => file.endsWith('.json'))
        .map((file) => path.basename(file, '.json'))

    orderedObject(names, Object.fromEntries(sourceNames.map((name) => [name, true])), group)

    return orderedObject(
        names,
        Object.fromEntries(names.map((name) => [name, readJson(`defs/${group}/${name}.json`)])),
        group
    )
}

function assertRegistryRefs(registry) {
    for (const group of ['fields', 'sections', 'blueprints']) {
        for (const name of registry.root[group]) {
            if (!registry[group].includes(name)) {
                throw new Error(`Unknown root ${group} entry: ${name}`)
            }
        }
    }
}

function withGeneratedWrapperSections(wrappers, registry) {
    const pattern = wrappers.sections.patternProperties['.*']

    pattern.anyOf = [
        ...pattern.anyOf,
        ...schemaRefs('sections', registry.root.sections),
    ]

    return orderedObject(registry.wrappers, wrappers, 'wrappers')
}

function buildWrapperField(registry) {
    const wrapperField = readJson('defs/wrappers/wrapper-field.json')

    return {
        ...wrapperField,
        anyOf: [
            ...wrapperField.anyOf,
            ...schemaRefs('fields', registry.root.fields),
        ],
    }
}

function buildKirby5Schema() {
    const root = readJson('root.json')
    const registry = readJson('registry.json')
    assertRegistryRefs(registry)
    const commonDefinitions = loadDefinitionMap([
        'defs/common/primitives.json',
        'defs/common/enums.json',
        'defs/common/structures.json',
    ])
    const definitions = {
        ...commonDefinitions,
        'blueprint-properties': readJson('defs/properties/blueprint.json'),
        blueprints: loadDefinitionFiles('blueprints', registry.blueprints),
        'field-properties': readJson('defs/properties/field.json'),
        fields: loadDefinitionFiles('fields', registry.fields),
        sections: loadDefinitionFiles('sections', registry.sections),
        wrappers: withGeneratedWrapperSections(readJson('defs/wrappers/wrappers.json'), registry),
        wrapperField: buildWrapperField(registry),
        fieldShortcuts: readJson('defs/wrappers/field-shortcuts.json'),
    }

    return {
        ...root,
        oneOf: [
            ...schemaRefs('fields', registry.root.fields),
            ...schemaRefs('sections', registry.root.sections),
            ...schemaRefs('blueprints', registry.root.blueprints),
        ],
        $defs: orderedObject(registry.$defs, definitions, '$defs'),
    }
}

function formatSchema(schema) {
    return `${JSON.stringify(schema, null, 2)}\n`
}

function main(argv) {
    const check = argv.includes('--check')
    const generated = formatSchema(buildKirby5Schema())

    if (check) {
        const published = fs.readFileSync(outputPath, 'utf8')

        if (generated !== published) {
            console.error('Generated Kirby 5 schema does not match kirby5-blueprints.schema.json')
            process.exitCode = 1
        }

        return
    }

    fs.writeFileSync(outputPath, generated)
}

if (require.main === module) {
    main(process.argv.slice(2))
}

module.exports = {
    buildKirby5Schema,
}
