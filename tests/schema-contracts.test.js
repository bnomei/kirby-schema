const {
    BLUEPRINT_DEFS,
    CORE_SECTIONS,
    INACTIVE_FIELD_DEFS,
    ROOT_BLUEPRINT_REFS,
    ROOT_FIELD_REFS,
    ROOT_SECTION_REFS,
    WRAPPER_DEFS,
} = require('./manifests/coverage')
const {
    SCHEMA_PROPERTY_MANIFEST,
} = require('./manifests/properties')
const {
    collectRefs,
    compileRef,
    schema,
} = require('./helpers/schema')

const schemaGroups = ['fields', 'sections', 'blueprints']
const branchPropertyCases = schemaGroups.flatMap((group) => Object.entries(SCHEMA_PROPERTY_MANIFEST[group]).map(([name, properties]) => [
    group,
    name,
    properties,
]))
const branchDefinitionCases = schemaGroups.flatMap((group) => Object.keys(SCHEMA_PROPERTY_MANIFEST[group]).map((name) => [
    group,
    name,
    schema.$defs[group][name],
]))
const invalidShapeCases = [
    ['files field query object', '#/$defs/fields/files', {type: 'files', query: {fetch: 'site.files'}}],
    ['pages field query object', '#/$defs/fields/pages', {type: 'pages', query: {fetch: 'site.children'}}],
    ['users field search object', '#/$defs/fields/users', {type: 'users', search: {min: 2}}],
    ['files section create array', '#/$defs/sections/files', {type: 'files', create: ['image']}],
    ['files section status', '#/$defs/sections/files', {type: 'files', status: 'listed'}],
    ['files section uploads', '#/$defs/sections/files', {type: 'files', uploads: 'image'}],
    ['files section template array', '#/$defs/sections/files', {type: 'files', template: ['image']}],
    ['files section query object', '#/$defs/sections/files', {type: 'files', query: {fetch: 'page.files'}}],
    ['files section search object', '#/$defs/sections/files', {type: 'files', search: {min: 2}}],
    ['files section unsupported layout', '#/$defs/sections/files', {type: 'files', layout: 'grid'}],
    ['pages section query object', '#/$defs/sections/pages', {type: 'pages', query: {fetch: 'site.children'}}],
    ['pages section search object', '#/$defs/sections/pages', {type: 'pages', search: {min: 2}}],
    ['pages section unsupported status', '#/$defs/sections/pages', {type: 'pages', status: 'archived'}],
    ['pages section unsupported layout', '#/$defs/sections/pages', {type: 'pages', layout: 'grid'}],
    ['link field option map', '#/$defs/fields/link', {type: 'link', options: {page: 'Page'}}],
    ['headline field numbered flag', '#/$defs/fields/headline', {type: 'headline', numbered: false}],
    ['number field arbitrary string step', '#/$defs/fields/number', {type: 'number', step: 'week'}],
    ['field stats auto size', '#/$defs/fields/stats', {type: 'stats', size: 'auto'}],
    ['section stats full size', '#/$defs/sections/stats', {type: 'stats', size: 'full'}],
]

function refsFor(group, names) {
    return names.map((name) => `#/$defs/${group}/${name}`)
}

function wrapperFieldRefs() {
    return schema.$defs.wrapperField.anyOf
        .map((entry) => entry.$ref)
        .filter((ref) => ref && ref.startsWith('#/$defs/fields/'))
}

describe('schema inventory', () => {
    test('top-level oneOf covers the documented Kirby 5 root branches in stable order', () => {
        expect(schema.oneOf.map((entry) => entry.$ref)).toEqual([
            ...refsFor('fields', ROOT_FIELD_REFS),
            ...refsFor('sections', ROOT_SECTION_REFS),
            ...refsFor('blueprints', ROOT_BLUEPRINT_REFS),
        ])
    })

    test('field wrapper covers every active core field and no inactive field defs', () => {
        expect(wrapperFieldRefs()).toEqual(refsFor('fields', ROOT_FIELD_REFS))
    })

    test('named definition groups match the coverage manifest', () => {
        expect(Object.keys(schema.$defs.sections)).toEqual(CORE_SECTIONS)
        expect(Object.keys(schema.$defs.blueprints)).toEqual(BLUEPRINT_DEFS)
        expect(Object.keys(schema.$defs.wrappers)).toEqual(WRAPPER_DEFS)
    })

    test('inactive field defs are explicit and unreachable', () => {
        const allRefs = collectRefs(schema)

        expect(Object.keys(schema.$defs.fields).filter((name) => !ROOT_FIELD_REFS.includes(name))).toEqual(INACTIVE_FIELD_DEFS)

        for (const name of INACTIVE_FIELD_DEFS) {
            expect(allRefs.has(`#/$defs/fields/${name}`)).toBe(false)
        }
    })
})

describe('schema property manifest', () => {
    test.each(schemaGroups)('%s branch names match the pinned property manifest', (group) => {
        expect(Object.keys(schema.$defs[group])).toEqual(Object.keys(SCHEMA_PROPERTY_MANIFEST[group]))
    })

    test.each(branchPropertyCases)('%s/%s property names match the pinned manifest', (group, name, properties) => {
        expect(Object.keys(schema.$defs[group][name].properties || {})).toEqual(properties)
    })
})

describe('negative schema contracts', () => {
    test.each(branchDefinitionCases)('%s/%s rejects unknown properties by schema contract', (group, name, definition) => {
        expect(definition.additionalProperties).toBe(false)
    })

    test.each(Object.keys(SCHEMA_PROPERTY_MANIFEST.fields))('fields/%s pins its type discriminator', (name) => {
        expect(schema.$defs.fields[name].properties.type).toEqual({
            enum: [name],
        })
    })

    test.each(Object.keys(SCHEMA_PROPERTY_MANIFEST.sections))('sections/%s pins its type discriminator', (name) => {
        expect(schema.$defs.sections[name].properties.type).toEqual({
            enum: [name],
        })
    })

    test.each(Object.keys(SCHEMA_PROPERTY_MANIFEST.blueprints))('blueprints/%s pins its blueprint discriminator', (name) => {
        expect(schema.$defs.blueprints[name].properties.blueprint).toEqual({
            enum: [name],
        })
    })

    test.each(invalidShapeCases)('%s is rejected', (name, ref, value) => {
        const validate = compileRef(ref)

        expect(validate(value)).toBe(false)
    })
})
