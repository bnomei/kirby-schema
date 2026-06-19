const fs = require('fs')
const path = require('path')
const Ajv2020 = require('ajv/dist/2020')
const yaml = require('js-yaml')

const schema = require('../../kirby5-blueprints.schema.json')

const ajvOptions = {
    strictTypes: false,
    allowMatchingProperties: true,
}

const fixturesRoot = path.join(__dirname, '..', 'fixtures')
const fixtureSourcesRoot = path.join(__dirname, '..', 'fixture-sources')

function createAjv() {
    return new Ajv2020(ajvOptions)
}

function compileFinalSchema() {
    return createAjv().compile(schema)
}

function compileRef(ref) {
    return createAjv().compile({
        $schema: schema.$schema,
        $defs: schema.$defs,
        $ref: ref,
    })
}

function fixturePath(...segments) {
    return path.join(fixturesRoot, ...segments)
}

function sourceFixturePath(...segments) {
    return path.join(fixtureSourcesRoot, ...segments)
}

function listFixtureNames(group) {
    return fs
        .readdirSync(fixturePath(group))
        .filter((file) => file.endsWith('.yml'))
        .map((file) => path.basename(file, '.yml'))
        .sort()
}

function listFixtureFiles(dir = fixturesRoot, root = fixturesRoot) {
    return fs
        .readdirSync(dir, {withFileTypes: true})
        .flatMap((entry) => {
            const fullPath = path.join(dir, entry.name)

            if (entry.isDirectory()) {
                return listFixtureFiles(fullPath, root)
            }

            if (entry.isFile() && entry.name.endsWith('.yml')) {
                return path.relative(root, fullPath)
            }

            return []
        })
        .sort()
}

function listValidationFixtureFiles() {
    return listFixtureFiles()
}

function listCanonicalFixtureFiles({includeWrappers = true} = {}) {
    return listFixtureFiles(fixturePath('canonical'))
        .filter((file) => includeWrappers || !file.startsWith('canonical/wrappers/'))
}

function listCanonicalFixtureNames(group) {
    return listFixtureNames(path.join('canonical', group))
}

function listDocsFixtureFiles() {
    return listFixtureFiles(fixturePath('docs'))
}

function listCoverageFixtureFiles() {
    return listFixtureFiles(fixturePath('coverage'))
}

function listCoverageFullFixtureFiles() {
    return listCoverageFixtureFiles()
        .filter((file) => file.endsWith('/full.yml'))
}

function listCoverageVariantFixtureFiles() {
    return listCoverageFixtureFiles()
        .filter((file) => file.startsWith('coverage/variants/'))
}

function listProjectFixtureFiles(project) {
    return listFixtureFiles(fixturePath('projects', project))
}

function listSourceFixtureFiles(dir = fixtureSourcesRoot) {
    return listFixtureFiles(dir, dir)
}

function readFixture(relativePath) {
    return yaml.load(fs.readFileSync(fixturePath(relativePath), 'utf8'))
}

function readSourceFixture(relativePath) {
    return yaml.load(fs.readFileSync(sourceFixturePath(relativePath), 'utf8'))
}

function collectRefs(value, refs = new Set()) {
    if (!value || typeof value !== 'object') {
        return refs
    }

    if (typeof value.$ref === 'string') {
        refs.add(value.$ref)
    }

    for (const child of Object.values(value)) {
        collectRefs(child, refs)
    }

    return refs
}

module.exports = {
    collectRefs,
    compileFinalSchema,
    compileRef,
    fixturePath,
    listCanonicalFixtureFiles,
    listCanonicalFixtureNames,
    listCoverageFullFixtureFiles,
    listCoverageVariantFixtureFiles,
    listDocsFixtureFiles,
    listProjectFixtureFiles,
    listSourceFixtureFiles,
    listValidationFixtureFiles,
    readFixture,
    readSourceFixture,
    schema,
    sourceFixturePath,
}
