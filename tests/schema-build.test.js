const fs = require('fs')
const path = require('path')
const {execFileSync} = require('child_process')

const {buildKirby5Schema} = require('../scripts/build-kirby5-schema')
const registry = require('../schema/kirby5/registry.json')

const repoRoot = path.join(__dirname, '..')
const schemaPath = path.join(repoRoot, 'kirby5-blueprints.schema.json')

function formatSchema(schema) {
    return `${JSON.stringify(schema, null, 2)}\n`
}

function refsFor(group, names) {
    return names.map((name) => `#/$defs/${group}/${name}`)
}

describe('Kirby 5 schema build', () => {
    test('check command matches the published artifact', () => {
        execFileSync(process.execPath, ['scripts/build-kirby5-schema.js', '--check'], {
            cwd: repoRoot,
            stdio: 'pipe',
        })
    })

    test('buildKirby5Schema matches the published artifact byte-for-byte', () => {
        const published = fs.readFileSync(schemaPath, 'utf8')

        expect(formatSchema(buildKirby5Schema())).toBe(published)
    })

    test('generated refs and definition order come from the registry', () => {
        const generated = buildKirby5Schema()
        const wrapperSections = generated.$defs.wrappers.sections.patternProperties['.*'].anyOf

        expect(Object.keys(generated.$defs)).toEqual(registry.$defs)
        expect(generated.oneOf.map((entry) => entry.$ref)).toEqual([
            ...refsFor('fields', registry.root.fields),
            ...refsFor('sections', registry.root.sections),
            ...refsFor('blueprints', registry.root.blueprints),
        ])
        expect(generated.$defs.wrapperField.anyOf.slice(2).map((entry) => entry.$ref)).toEqual(refsFor('fields', registry.root.fields))
        expect(wrapperSections.slice(3).map((entry) => entry.$ref)).toEqual(refsFor('sections', registry.root.sections))
    })
})
