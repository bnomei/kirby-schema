const fs = require('fs')

const {
    BLUEPRINT_FIXTURES,
    WRAPPERS,
} = require('./manifests/coverage')
const {
    SCHEMA_PROPERTY_MANIFEST,
} = require('./manifests/properties')
const {
    compileRef,
    fixturePath,
    listCanonicalFixtureFiles,
    listCanonicalFixtureNames,
    listCoverageFullFixtureFiles,
    listCoverageVariantFixtureFiles,
    readFixture,
    schema,
} = require('./helpers/schema')

const coverageGroups = ['fields', 'sections', 'blueprints']
const variantShapeCases = [
    ['labels-translations', '#/$defs/stringOrTranslated', '/title'],
    ['labels-translations', '#/$defs/field-properties/@label', '/fields/title/label'],
    ['labels-translations', '#/$defs/field-properties/@before', '/fields/title/before'],
    ['labels-translations', '#/$defs/field-properties/@after', '/fields/title/after'],
    ['labels-translations', '#/$defs/field-properties/@placeholder', '/fields/title/placeholder'],
    ['labels-translations', '#/$defs/field-properties/@empty', '/fields/files/empty'],
    ['labels-translations', '#/$defs/field-properties/@text', '/fields/note/text'],
    ['labels-translations', '#/$defs/field-properties/@headline', '/sections/intro/headline'],
    ['labels-translations', '#/$defs/field-properties/@text', '/sections/intro/text'],
    ['options-map', '#/$defs/field-properties/@options', '/fields/category/options'],
    ['options-list', '#/$defs/field-properties/@options', '/fields/category/options'],
    ['options-list', '#/$defs/optionsProvider', '/fields/category/options'],
    ['options-translated-map', '#/$defs/field-properties/@options', '/fields/category/options'],
    ['options-query', '#/$defs/field-properties/@options', '/fields/category/options'],
    ['options-query', '#/$defs/field-properties/@query', '/fields/category/query'],
    ['options-api', '#/$defs/field-properties/@options', '/fields/category/options'],
    ['options-api', '#/$defs/field-properties/@api', '/fields/category/api'],
    ['options-api', '#/$defs/field-properties/@search', '/fields/category/search'],
    ['string-or-array-values', '#/$defs/stringOrStringArrayUnique', '/navigation/status'],
    ['string-or-array-values', '#/$defs/stringOrStringArrayUnique', '/navigation/template'],
    ['boolean-object-toggles', '#/$defs/booleanOrObject', '/options/update'],
    ['boolean-object-toggles', '#/$defs/booleanOrObject', '/options/delete'],
    ['image', '#/$defs/blueprint-properties/@image', '/image'],
    ['image', '#/$defs/field-properties/@image', '/fields/cover/image'],
    ['accept', '#/$defs/blueprints/file/properties/accept', '/accept'],
    ['permissions', '#/$defs/blueprint-properties/@options', '/options'],
    ['permissions', '#/$defs/blueprint-properties/@permissions', '/permissions'],
    ['uploads', '#/$defs/field-properties/@uploads', '/fields/files/uploads'],
    ['uploads', '#/$defs/field-properties/@uploads', '/fields/text/uploads'],
    ['columns', '#/$defs/wrappers/columns', '/columns'],
    ['columns', '#/$defs/field-properties/@columns', '/fields/products/columns'],
    ['buttons', '#/$defs/blueprint-properties/@buttons', '/buttons'],
    ['buttons', '#/$defs/field-properties/@buttons', '/fields/body/buttons'],
    ['buttons', '#/$defs/field-properties/@buttons', '/fields/notes/buttons'],
    ['when', '#/$defs/field-properties/@when', '/fields/title/when'],
    ['when', '#/$defs/field-properties/@when', '/sections/drafts/when'],
    ['query', '#/$defs/field-properties/@query', '/fields/related/query'],
    ['query', '#/$defs/field-properties/@pickerQuery', '/fields/cover/query'],
    ['query', '#/$defs/field-properties/@pickerSearch', '/fields/cover/search'],
    ['query', '#/$defs/nonEmptyString', '/sections/children/query'],
    ['query', '#/$defs/field-properties/@pickerQuery', '/sections/children/query'],
    ['query', '#/$defs/field-properties/@pickerSearch', '/sections/children/search'],
]

function expectedRootRef(relativePath, data) {
    const [, group, file] = relativePath.split('/')
    const name = file.replace(/\.yml$/, '')

    if (group === 'fields') {
        return `#/$defs/fields/${name}`
    }

    if (group === 'sections') {
        return `#/$defs/sections/${name}`
    }

    if (group === 'pages') {
        return '#/$defs/blueprints/page'
    }

    if (group === 'blueprints') {
        if (name === 'field') {
            return `#/$defs/fields/${data.type}`
        }

        if (name === 'section') {
            return `#/$defs/sections/${data.type}`
        }

        return `#/$defs/blueprints/${name}`
    }

    return null
}

function expectedCoverageRef(relativePath) {
    const [, group, name] = relativePath.split('/')

    return `#/$defs/${group}/${name}`
}

function expectedCoverageFullFixtureFiles() {
    return coverageGroups
        .flatMap((group) => Object.keys(SCHEMA_PROPERTY_MANIFEST[group]).map((name) => `coverage/${group}/${name}/full.yml`))
        .sort()
}

function coverageBranch(relativePath) {
    const [, group, name] = relativePath.split('/')

    return [group, name]
}

function pointerValue(data, pointer) {
    return pointer
        .replace(/^\//, '')
        .split('/')
        .filter(Boolean)
        .reduce((value, key) => value && value[key.replace(/~1/g, '/').replace(/~0/g, '~')], data)
}

describe('canonical fixture inventory', () => {
    test('blueprint fixtures cover root and reusable blueprint forms', () => {
        expect(listCanonicalFixtureNames('blueprints')).toEqual(BLUEPRINT_FIXTURES)
    })

    test('wrapper fixtures cover every wrapper shape exactly once', () => {
        expect(listCanonicalFixtureNames('wrappers')).toEqual(WRAPPERS)
    })
})

describe('exhaustive coverage fixtures', () => {
    const fullFixtureFiles = listCoverageFullFixtureFiles()

    test('full coverage fixtures exist for every pinned branch exactly once', () => {
        expect(fullFixtureFiles).toEqual(expectedCoverageFullFixtureFiles())
    })

    test.each(fullFixtureFiles)('%s has a branch provenance marker', (relativePath) => {
        const source = fs.readFileSync(fixturePath(relativePath), 'utf8')

        expect(source.split('\n')[0]).toBe(`# Covers: ${expectedCoverageRef(relativePath)}`)
    })

    test.each(fullFixtureFiles)('%s validates against its exact schema branch', (relativePath) => {
        const data = readFixture(relativePath)
        const validate = compileRef(expectedCoverageRef(relativePath))
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

    test.each(fullFixtureFiles)('%s contains every pinned branch property', (relativePath) => {
        const [group, name] = coverageBranch(relativePath)
        const data = readFixture(relativePath)

        expect(Object.keys(data)).toEqual(SCHEMA_PROPERTY_MANIFEST[group][name])
    })
})

describe('reusable value-shape variant fixtures', () => {
    const variantFixtureFiles = listCoverageVariantFixtureFiles()
    const expectedVariantFiles = [...new Set(variantShapeCases.map(([name]) => `coverage/variants/${name}.yml`))].sort()

    test('variant fixtures cover the pinned reusable shape taxonomy exactly once', () => {
        expect(variantFixtureFiles).toEqual(expectedVariantFiles)
    })

    test.each(expectedVariantFiles)('%s has a variant provenance marker', (relativePath) => {
        const source = fs.readFileSync(fixturePath(relativePath), 'utf8')
        const name = relativePath.split('/').pop().replace(/\.yml$/, '')

        expect(source.split('\n')[0]).toBe(`# Covers: variant/${name}`)
    })

    test.each(variantShapeCases)('%s covers %s at %s', (name, ref, pointer) => {
        const relativePath = `coverage/variants/${name}.yml`
        const data = readFixture(relativePath)
        const value = pointerValue(data, pointer)
        const validate = compileRef(ref)
        const valid = validate(value)

        expect(value).not.toBeUndefined()
        expect({
            file: fixturePath(relativePath),
            ref,
            pointer,
            valid,
            errors: validate.errors,
        }).toEqual({
            file: fixturePath(relativePath),
            ref,
            pointer,
            valid: true,
            errors: null,
        })
    })
})

describe('root branch coverage', () => {
    const rootBranchRefs = schema.oneOf.map((entry) => entry.$ref)
    const rootBranches = rootBranchRefs.map((ref) => [ref, compileRef(ref)])
    const rootFixtureFiles = listCanonicalFixtureFiles({includeWrappers: false})

    test.each(rootFixtureFiles)('%s matches exactly one root branch', (relativePath) => {
        const data = readFixture(relativePath)
        const matches = rootBranches
            .filter(([, validate]) => validate(data))
            .map(([ref]) => ref)

        expect(matches).toEqual([expectedRootRef(relativePath, data)])
    })

    test('every top-level root branch has fixture coverage', () => {
        const coveredRefs = new Set(
            rootFixtureFiles.map((relativePath) => {
                const data = readFixture(relativePath)

                return expectedRootRef(relativePath, data)
            })
        )

        expect([...coveredRefs].sort()).toEqual([...rootBranchRefs].sort())
    })
})
