const validate = require('./validate')

test('blocks', () => {
    expect(validate('./tests/fixtures/fields/blocks.yml')).toBeTruthy();
});

test('checkboxes', () => {
    expect(validate('./tests/fixtures/fields/checkboxes.yml')).toBeTruthy();
});

test('color', () => {
    expect(validate('./tests/fixtures/fields/color.yml')).toBeTruthy();
});

test('date', () => {
    expect(validate('./tests/fixtures/fields/date.yml')).toBeTruthy();
});

test('email', () => {
    expect(validate('./tests/fixtures/fields/email.yml')).toBeTruthy();
});

test('entries', () => {
    expect(validate('./tests/fixtures/fields/entries.yml')).toBeTruthy();
});

test('files', () => {
    expect(validate('./tests/fixtures/fields/files.yml')).toBeTruthy();
});

test('gap', () => {
    expect(validate('./tests/fixtures/fields/gap.yml')).toBeTruthy();
});

test('headline', () => {
    expect(validate('./tests/fixtures/fields/headline.yml')).toBeTruthy();
});

test('hidden', () => {
    expect(validate('./tests/fixtures/fields/hidden.yml')).toBeTruthy();
});

test('info', () => {
    expect(validate('./tests/fixtures/fields/info.yml')).toBeTruthy();
});

test('layout', () => {
    expect(validate('./tests/fixtures/fields/layout.yml')).toBeTruthy();
});

test('line', () => {
    expect(validate('./tests/fixtures/fields/line.yml')).toBeTruthy();
});

test('link', () => {
    expect(validate('./tests/fixtures/fields/link.yml')).toBeTruthy();
});

test('list', () => {
    expect(validate('./tests/fixtures/fields/list.yml')).toBeTruthy();
});

test('multiselect', () => {
    expect(validate('./tests/fixtures/fields/multiselect.yml')).toBeTruthy();
});

test('number', () => {
    expect(validate('./tests/fixtures/fields/number.yml')).toBeTruthy();
});

test('object', () => {
    expect(validate('./tests/fixtures/fields/object.yml')).toBeTruthy();
});

test('pages', () => {
    expect(validate('./tests/fixtures/fields/pages.yml')).toBeTruthy();
});

test('radio', () => {
    expect(validate('./tests/fixtures/fields/radio.yml')).toBeTruthy();
});

test('range', () => {
    expect(validate('./tests/fixtures/fields/range.yml')).toBeTruthy();
});

test('select', () => {
    expect(validate('./tests/fixtures/fields/select.yml')).toBeTruthy();
});

test('slug', () => {
    expect(validate('./tests/fixtures/fields/slug.yml')).toBeTruthy();
});

test('structure', () => {
    expect(validate('./tests/fixtures/fields/structure.yml')).toBeTruthy();
});

test('stats', () => {
    expect(validate('./tests/fixtures/fields/stats.yml')).toBeTruthy();
});

test('tags', () => {
    expect(validate('./tests/fixtures/fields/tags.yml')).toBeTruthy();
});

test('tel', () => {
    expect(validate('./tests/fixtures/fields/tel.yml')).toBeTruthy();
});

test('text', () => {
    expect(validate('./tests/fixtures/fields/text.yml')).toBeTruthy();
});

test('textarea', () => {
    expect(validate('./tests/fixtures/fields/textarea.yml')).toBeTruthy();
});

test('time', () => {
    expect(validate('./tests/fixtures/fields/time.yml')).toBeTruthy();
});

test('toggle', () => {
    expect(validate('./tests/fixtures/fields/toggle.yml')).toBeTruthy();
});

test('toggles', () => {
    expect(validate('./tests/fixtures/fields/toggles.yml')).toBeTruthy();
});

test('url', () => {
    expect(validate('./tests/fixtures/fields/url.yml')).toBeTruthy();
});

test('users', () => {
    expect(validate('./tests/fixtures/fields/users.yml')).toBeTruthy();
});

test('writer', () => {
    expect(validate('./tests/fixtures/fields/writer.yml')).toBeTruthy();
});
