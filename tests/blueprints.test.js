const validate = require('./validate')

test('block', () => {
    expect(validate('./tests/fixtures/blueprints/block.yml')).toBeTruthy();
});

test('field', () => {
    expect(validate('./tests/fixtures/blueprints/field.yml')).toBeTruthy();
});

test('file', () => {
    expect(validate('./tests/fixtures/blueprints/file.yml')).toBeTruthy();
});

test('page', () => {
    expect(validate('./tests/fixtures/blueprints/page.yml')).toBeTruthy();
});

test('section', () => {
    expect(validate('./tests/fixtures/blueprints/section.yml')).toBeTruthy();
});

test('site', () => {
    expect(validate('./tests/fixtures/blueprints/site.yml')).toBeTruthy();
});

test('user', () => {
    expect(validate('./tests/fixtures/blueprints/user.yml')).toBeTruthy();
});

test('tab', () => {
    expect(validate('./tests/fixtures/blueprints/tab.yml')).toBeTruthy();
});
