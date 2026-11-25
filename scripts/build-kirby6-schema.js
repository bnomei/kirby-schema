const fs = require('fs')
const path = require('path')
const source = path.join(__dirname, '../schema/kirby6')
const read = (file) => JSON.parse(fs.readFileSync(path.join(source, file), 'utf8'))
const ref = (key) => ({$ref: `#/$defs/${key}`})

const $defs = read('common.json')
for (const key of ['blueprints', 'blueprint-properties', 'field-properties']) $defs[key] = read(`${key}.json`)
const fields = $defs.fields = Object.fromEntries(fs.readdirSync(path.join(source, 'fields')).sort()
    .filter((file) => file.endsWith('.json'))
    .map((file) => [path.basename(file, '.json'), read(`fields/${file}`)]))

function withType(field, type) {
    return {...field, properties: {...field.properties, type: {const: type}}}
}

// Core::fields registers password as a text field. The Normalizer keeps the
// old field names as picker aliases, but converts sections into list fields.
fields.password = withType(fields.text, 'password')
for (const [legacy, type] of Object.entries({files: 'filepicker', pages: 'pagepicker', users: 'userpicker'})) {
    fields[legacy] = {...withType(fields[type], legacy), deprecated: true, description: `Use ${type} instead.`}
}
for (const [legacy, type] of Object.entries({files: 'filelist', pages: 'pagelist', info: 'info', stats: 'stats'})) {
    const section = withType(fields[type], legacy)
    section.properties.headline = ref('field-properties/@headline')
    if (type !== 'filelist') section.properties.blueprint = {const: 'section'}
    $defs.sections[legacy] = section
}

// A mapping key can supply a built-in type (`tags: true`, `files: {layout: cards}`).
// Other names need a type or an extension. False disables an inherited entry.
function entryMap(group, entry) {
    const names = Object.keys($defs[group])
    const definition = `${entry}Definition`
    $defs[definition] = {
        type: 'object', anyOf: names.map((name) => ref(`${group}/${name}`)),
        allOf: [{anyOf: [{required: ['type']}, {required: ['extends']}]}],
    }
    $defs[entry] = {anyOf: [ref(definition), ref('nonEmptyString'), {const: false}]}
    const inferred = group === 'fields' ? {enum: [true, null]} : {const: true}
    return {
        type: 'object',
        properties: Object.fromEntries(names.map((name) => [name, {anyOf: [ref(entry), ref(`${group}/${name}`), inferred]}])),
        additionalProperties: ref(entry),
    }
}
$defs.fieldMap = entryMap('fields', 'wrapperField')
$defs.wrappers.sections = entryMap('sections', 'sectionEntry')

const output = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://raw.githubusercontent.com/bnomei/kirby-schema/refs/heads/main/kirby6-blueprints.schema.json',
    title: 'JSON schema for Kirby 6 CMS blueprint files',
    type: 'object',
    anyOf: [ref('wrapperFieldDefinition'), ref('sectionEntryDefinition'),
        ...Object.keys($defs.blueprints).map((name) => ref(`blueprints/${name}`))],
    $defs,
}

const file = path.join(__dirname, '..', 'kirby6-blueprints.schema.json')
const json = `${JSON.stringify(output, null, 2)}\n`
if (process.argv.includes('--check')) {
    if (fs.readFileSync(file, 'utf8') !== json) {
        throw new Error('Run npm run build:schema to update kirby6-blueprints.schema.json')
    }
} else {
    fs.writeFileSync(file, json)
}
