const validate = require('./validate')

test('page001', () => {
    expect(validate('./tests/fixtures/misc/page001.yml')).toBeTruthy();
});

test('page002', () => {
    expect(validate('./tests/fixtures/misc/page002.yml')).toBeTruthy();
});

test('page003', () => {
    expect(validate('./tests/fixtures/misc/page003.yml')).toBeTruthy();
});

test('page004', () => {
    expect(validate('./tests/fixtures/misc/page004.yml')).toBeTruthy();
});