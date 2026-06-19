const fs = require('fs')

const {
    DOC_BLUEPRINTS,
    DOC_FIELDS,
    DOC_REUSABLE,
    DOC_SECTIONS,
} = require('./manifests/docs')
const {
    compileFinalSchema,
    fixturePath,
    listDocsFixtureFiles,
    readFixture,
} = require('./helpers/schema')

const validate = compileFinalSchema()

function childDirectoryNames(...segments) {
    return fs
        .readdirSync(fixturePath(...segments), {withFileTypes: true})
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
}

test('docs fixture folders cover the official reference groups', () => {
    expect(childDirectoryNames('docs', 'fields')).toEqual(DOC_FIELDS)
    expect(childDirectoryNames('docs', 'sections')).toEqual(DOC_SECTIONS)
    expect(childDirectoryNames('docs', 'blueprints').filter((name) => DOC_BLUEPRINTS.includes(name))).toEqual(DOC_BLUEPRINTS)
    expect(childDirectoryNames('docs', 'reusable')).toEqual(DOC_REUSABLE)
})

test('docs fixture files are consolidated YAML examples', () => {
    const docsFixtureFiles = listDocsFixtureFiles()

    expect(docsFixtureFiles.length).toBeGreaterThan(0)
    expect(docsFixtureFiles.some((relativePath) => relativePath.startsWith('docs/generated/'))).toBe(false)
    expect(docsFixtureFiles.every((relativePath) => relativePath.endsWith('.yml'))).toBe(true)
})

test.each(listDocsFixtureFiles())('%s validates against final schema', (relativePath) => {
    const data = readFixture(relativePath)
    const valid = validate(data)

    expect({
        file: fixturePath(relativePath),
        valid,
        errors: validate.errors,
    }).toEqual({
        file: fixturePath(relativePath),
        valid: true,
        errors: null,
    })
})

test.each(listDocsFixtureFiles())('%s includes source provenance', (relativePath) => {
    const source = fs.readFileSync(fixturePath(relativePath), 'utf8')

    expect({
        file: fixturePath(relativePath),
        source: source.split('\n')[0],
    }).toEqual({
        file: fixturePath(relativePath),
        source: expect.stringMatching(/^# Source: https:\/\/getkirby\.com\/docs\//),
    })
})
