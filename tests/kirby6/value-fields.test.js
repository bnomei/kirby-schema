const validate = require('./validate')
const field = (type, props) => validate({blueprint: 'field', type, ...props})

describe('Kirby 6 choice fields', () => {
    test.each(['checkboxes', 'color', 'multiselect', 'radio', 'select', 'tags', 'toggles'])(
        '%s takes the source inside options, not from a sibling property', (type) => {
            const query = {type: 'query', query: 'site.children', value: '{{ page.id }}'}
            expect(field(type, {options: query})).toBe(true)
            expect(field(type, {options: query, query: 'site.index'})).toBe(false)
            expect(field(type, {options: query, api: '/ignored.json'})).toBe(false)
        },
    )

    test.each([
        ['query shorthand', 'site.children'],
        ['fetch alias', {type: 'query', fetch: 'site.children', text: '{{ page.title }}'}],
        ['API', {type: 'api', url: '/regions.json', query: 'data.items', icon: '{{ item.icon }}'}],
        ['manual array', ['draft', {value: 'live', text: {en: 'Published'}, disabled: true}]],
        ['manual map', {draft: 'Draft', live: {en: 'Published', de: 'Veröffentlicht'}}],
        ['explicit empty value and no info', [{value: '', text: 'None', info: false}]],
        ['wrapped array', {type: 'array', options: ['draft']}],
        ['wrapped map with literal type key', {type: 'array', options: {type: 'Type', city: 'City'}}],
    ])('accepts %s', (_, options) => expect(field('select', {options})).toBe(true))

    test.each([
        ['old query marker', 'query'], ['old API marker', 'api'],
        ['missing URL', {type: 'api', query: 'data'}],
        ['missing query', {type: 'query', text: 'Title'}],
        ['crossed provider keys', {type: 'query', query: 'site.children', url: '/x'}],
        ['query with a map instead of a string', {type: 'query', query: {fetch: 'site.children'}}],
        ['unknown type', {type: 'remote', url: '/x'}],
        ['array source with scalar data', {type: 'array', options: 'site.children'}],
        ['invalid option disguised as translations', {approved: {value: 'yes', disabled: 'yes'}}],
    ])('rejects %s even when a plain options map would match', (_, options) => {
        expect(field('select', {options})).toBe(false)
    })
})

describe('Kirby 6 field props', () => {
    test.each([
        ['text', {autocomplete: 'name', preselect: true, converter: 'label', validate: {minLength: 3}}],
        ['slug', {spellcheck: false, counter: true, font: 'mono'}],
        ['range', {placeholder: '0.5', min: 0.5, validate: 'positive'}],
        ['tags', {search: {display: 20, min: 3}}],
        ['writer', {toolbar: {inline: false, marks: false, nodes: ['heading']}, spellcheck: false}],
        ['date', {display: {en: 'DD [of] MMMM', de: 'DD.MM.'}, time: {display: {en: 'HH:mm'}, times: false}}],
        ['entries', {field: {type: 'select', options: {type: 'query', query: 'site.children'}}}],
        ['structure', {label: false, columns: {name: 'Headline', secret: false}, autofocus: true}],
        ['object', {autofocus: true, validate: ['notEmpty']}],
        ['stats', {size: 'tiny', width: '1/2', reports: ['page.viewsReport', {label: 'Views', value: 5}]}],
    ])('accepts %s with %j', (type, props) => expect(field(type, props)).toBe(true))

    test.each([
        ['text', {preselect: 'all'}], ['textarea', {preselect: true}],
        ['tags', {search: {display: 'Search categories'}}], ['time', {step: {size: 0.5}}],
        ['date', {times: false}], ['checkboxes', {max: 1.5}], ['text', {validate: false}],
        ['entries', {field: 'structure'}], ['entries', {field: {placeholder: 'No type'}}],
        ['entries', {limit: 3}], ['writer', {toolbar: {marks: 'bold'}}],
        ['stats', {reports: [{value: 5}]}], ['headline', {validate: 'notEmpty'}],
    ])('rejects %s with %j', (type, props) => expect(field(type, props)).toBe(false))

    test('uses the same option rules inside a model blueprint', () => {
        const category = {type: 'select', options: {type: 'api', url: '/categories.json'}}
        const page = {blueprint: 'page', fields: {category}}
        expect(validate(page)).toBe(true)
        delete category.options.url
        expect(validate(page)).toBe(false)
    })
})
