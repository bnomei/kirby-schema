const path = require('path')
const {
    compileFinalSchema,
    fixturePath,
    listProjectFixtureFiles,
    listSourceFixtureFiles,
    readFixture,
    readSourceFixture,
    sourceFixturePath,
} = require('./helpers/schema')

const validate = compileFinalSchema()
const starterkitSourceRoot = 'starterkit/site/blueprints'
const starterkitProjectRoot = 'projects/starterkit/site/blueprints'

function starterkitBlueprintFor(relativePath) {
    if (relativePath.startsWith('fields/')) {
        return 'field'
    }

    if (relativePath.startsWith('sections/')) {
        return 'section'
    }

    if (relativePath.startsWith('files/')) {
        return 'file'
    }

    if (relativePath.startsWith('pages/')) {
        return 'page'
    }

    if (relativePath.startsWith('users/')) {
        return 'user'
    }

    if (relativePath === 'site.yml') {
        return 'site'
    }

    throw new Error(`No starterkit blueprint hint for ${relativePath}`)
}

function stripProjectRoot(relativePath) {
    return relativePath.replace(`${starterkitProjectRoot}/`, '')
}

const starterkitSourceFiles = listSourceFixtureFiles(sourceFixturePath(starterkitSourceRoot))
const starterkitProjectFiles = listProjectFixtureFiles('starterkit')
const expectedStarterkitProjectFiles = starterkitSourceFiles
    .map((relativePath) => path.posix.join(starterkitProjectRoot, relativePath))
    .sort()

describe('starterkit project fixtures', () => {
    test('source inventory is copied from the starterkit blueprint tree', () => {
        expect(starterkitSourceFiles).toEqual([
            'fields/cover.yml',
            'files/blocks/image.yml',
            'files/image.yml',
            'pages/about.yml',
            'pages/album.yml',
            'pages/default.yml',
            'pages/error.yml',
            'pages/home.yml',
            'pages/note.yml',
            'pages/notes.yml',
            'pages/photography.yml',
            'sections/albums.yml',
            'sections/notes.yml',
            'site.yml',
            'users/default.yml',
        ])
    })

    test('normalized fixtures cover the starterkit source inventory', () => {
        expect(starterkitProjectFiles).toEqual(expectedStarterkitProjectFiles)
    })

    test.each(starterkitProjectFiles)('%s matches source plus blueprint discriminator', (relativePath) => {
        const sourceRelativePath = stripProjectRoot(relativePath)
        const source = readSourceFixture(path.posix.join(starterkitSourceRoot, sourceRelativePath))
        const normalized = readFixture(relativePath)

        expect(normalized).toEqual({
            blueprint: starterkitBlueprintFor(sourceRelativePath),
            ...source,
        })
    })

    test.each(starterkitProjectFiles)('%s validates against the Kirby 5 schema', (relativePath) => {
        const data = readFixture(relativePath)
        const valid = validate(data)

        expect({
            file: fixturePath(relativePath),
            errors: validate.errors,
        }).toEqual({
            file: fixturePath(relativePath),
            errors: null,
        })
        expect(valid).toBe(true)
    })
})
