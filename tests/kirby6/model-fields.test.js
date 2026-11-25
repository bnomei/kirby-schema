const validate = require('./validate')

function accepts(type, options) {
    return validate({fields: {example: {type, ...options}}})
}

describe('Kirby 6 model lists', () => {
    test.each(['filelist', 'pagelist'])('%s displays and filters models without selecting them', (type) => {
        expect(accepts(type, {
            layout: 'table', parent: 'site', page: 2, limit: 10, min: 0, max: 5,
            batch: true, sortable: false, sortBy: 'date desc', flip: false, search: true,
            info: {en: 'Modified'}, text: false, image: {query: false},
            columns: {
                image: false, date: true, title: 'Title',
                modified: {label: {en: 'Date'}, align: 'right', width: '10rem', mobile: true, type: 'text', value: '{{ model.modified }}'},
            },
        })).toBe(true)
        for (const invalid of [{multiple: true}, {store: 'id'}, {picker: {}}, {limit: 0.5}, {columns: ['title']}]) {
            expect(accepts(type, invalid)).toBe(false)
        }
    })

    test('filelist uses a single native blueprint, not a standalone hint or a picker upload setting', () => {
        expect(accepts('filelist', {blueprint: 'photos/cover', create: false})).toBe(true)
        expect(accepts('filelist', {template: 'photos/cover'})).toBe(true)
        for (const invalid of [{blueprint: ['image']}, {create: 'image'}, {uploads: 'image'}, {status: 'draft'}]) {
            expect(accepts('filelist', invalid)).toBe(false)
        }
    })

    test('pagelist accepts positive and exclusion filters under current and legacy names', () => {
        for (const key of ['blueprints', 'templates', 'template']) {
            for (const filter of ['article', ['article', 'note'], {except: 'error'}, {except: ['home', 'error']}]) {
                expect(accepts('pagelist', {[key]: filter})).toBe(true)
            }
        }
        expect(accepts('pagelist', {templatesIgnore: 'home', status: 'drafts', create: ['note']})).toBe(true)
        for (const invalid of [{blueprints: {only: 'note'}}, {blueprints: {except: true}}, {create: {except: 'error'}}, {status: 'archived'}]) {
            expect(accepts('pagelist', invalid)).toBe(false)
        }
    })
})

describe('Kirby 6 model pickers', () => {
    test.each(['pagepicker', 'pages', 'filepicker', 'files', 'userpicker', 'users'])('%s keeps field and dialog settings distinct', (type) => {
        expect(accepts(type, {
            autofocus: true, required: true, validate: {min: 1}, store: 'id', search: true,
            multiple: true, layout: 'cardlets', picker: {layout: 'cards', size: 'huge', image: false, limit: 12, hasSearch: false},
        })).toBe(true)
        for (const invalid of [{layout: 'table'}, {image: true}, {create: false}, {picker: {search: true}}, {picker: {size: 9}}]) {
            expect(accepts(type, invalid)).toBe(false)
        }
    })

    test('options that require a specific model do not leak to other pickers', () => {
        expect(accepts('pagepicker', {subpages: false, picker: {subpages: false}})).toBe(true)
        expect(accepts('userpicker', {default: true})).toBe(true)
        expect(accepts('filepicker', {parent: 'site.find("media")'})).toBe(true)
        expect(accepts('filepicker', {picker: {subpages: true}})).toBe(false)
        expect(accepts('users', {parent: 'site'})).toBe(false)
        expect(accepts('pagepicker', {uploads: false})).toBe(false)
    })

    test('textarea.files accepts a file query or the same file dialog settings', () => {
        expect(accepts('textarea', {files: 'site.files'})).toBe(true)
        expect(accepts('textarea', {files: {image: false, layout: 'cards', limit: 8}})).toBe(true)
        expect(accepts('textarea', {files: {subpages: true}})).toBe(false)
    })

    test.each(['filepicker', 'files', 'textarea'])('%s accepts one upload configuration', (type) => {
        for (const uploads of [false, true, 'gallery', {blueprint: 'gallery', parent: 'site'}, {template: 'blocks/image'}]) {
            expect(accepts(type, {uploads})).toBe(true)
        }
        for (const uploads of [['gallery'], {blueprint: ['gallery']}, {templates: 'gallery'}, {parent: false}]) {
            expect(accepts(type, {uploads})).toBe(false)
        }
    })
})

test('buttons takes a query or a list of model buttons, not a textarea toolbar', () => {
    expect(accepts('buttons', {buttons: 'page.shopButtons'})).toBe(true)
    expect(accepts('buttons', {buttons: [
        {text: {en: 'Shop'}, link: '{{ page.shopUrl }}', target: '_blank', badge: {text: 3, theme: 'positive'}},
        {title: {de: 'Titel ändern'}, icon: 'title', dialog: '{{ page.panel.path }}/changeTitle'},
        {text: 'History', drawer: '{{ page.panel.path }}/history', disabled: true},
    ]})).toBe(true)
    for (const buttons of [true, {shop: {link: '/shop'}}, ['bold'], [{link: true}], [{badge: 'new'}]]) {
        expect(accepts('buttons', {buttons})).toBe(false)
    }
    expect(accepts('textarea', {buttons: ['bold']})).toBe(true)
    expect(accepts('textarea', {buttons: [{link: '/shop'}]})).toBe(false)
})
