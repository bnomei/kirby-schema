const validate = require('./validate')
const {listSourceFixtureFiles, readSourceFixture, listDocsFixtureFiles, readFixture} = require('../helpers/schema')

test('a native layout places root fields by name without an IDE hint', () => {
    const blog = {
        title: 'Blog',
        status: {draft: true, listed: {label: 'Published', icon: '🌍', theme: 'positive'}},
        fields: {
            articles: {type: 'pagelist', blueprints: {except: ['error', 'home']}, layout: 'table'},
            cover: {type: 'filepicker', uploads: {blueprint: 'cover'}},
            gallery: {type: 'filelist', blueprint: 'image'},
            secret: {type: 'password'},
        },
        tabs: {
            content: {columns: [{width: '2/3', fields: ['articles', 'gallery']}, {width: '1/3', fields: ['cover']}]},
            settings: {fields: ['secret']},
        },
    }
    expect(validate(blog)).toBe(true)
    blog.tabs.content.columns[0].fields = [42]
    expect(validate(blog)).toBe(false)
})

test('the same legacy type is a list under sections and a picker under fields', () => {
    const page = {
        blueprint: 'page',
        sections: {
            articles: {type: 'pages', headline: 'Articles', templates: ['article'], layout: 'table'},
            files: {template: 'image', layout: 'cards'},
            info: {text: 'Select a cover'},
            stats: {reports: [{label: 'Count', value: 3}]},
            content: {type: 'fields', fields: {cover: {type: 'files', multiple: false}, tags: true}},
        },
    }
    expect(validate(page)).toBe(true)
    page.sections.content.fields.cover.layout = 'table'
    expect(validate(page)).toBe(false)
})

test.each([
    {title: 'Blog', preset: 'pages'},
    {sections: {gallery: {type: 'custom-section'}}},
    {sections: {gallery: {type: 'files', rawvalues: true}}},
    {fields: {gallery: {type: 'filelist', rawvalues: true}}},
    {fields: {gallery: {type: 'filelist', blueprint: ['image']}}},
    {status: {listed: {theme: 7}}},
])('rejects removed syntax or a malformed v6 option: %j', (data) => {
    expect(validate(data)).toBe(false)
})

// The 6.0.0 Starterkit still uses the v5-style blueprints in this corpus.
test.each(listSourceFixtureFiles())('loads the unmodified Starterkit blueprint %s', (file) => {
    expect(validate(readSourceFixture(file))).toBe(true)
})

// Replay the pinned Kirby 5 docs against v6, including examples whose old
// syntax should now produce an IDE diagnostic rather than a silent pass.
const incompatible = new Set([
    'docs/blueprints/page/basic.yml', // removed page preset
    'docs/fields/multiselect/basic.yml', // separate query provider
    'docs/fields/radio/basic.yml',
    'docs/fields/tags/04-limit-input-to-options.yml',
    'docs/fields/tags/accept-options-query.yml',
    'docs/fields/tags/basic.yml',
    'docs/fields/multiselect/search-object.yml', // search.display is an item count
    'docs/fields/writer/basic.yml', // toolbar.toolbar is not a toolbar option
    'docs/sections/files/options.yml', // removed rawvalues property
    'docs/sections/pages/template-array.yml',
])
test.each(listDocsFixtureFiles())('Kirby 5 compatibility: %s', (file) => {
    expect(validate(readFixture(file))).toBe(!incompatible.has(file))
})
