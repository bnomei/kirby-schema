const {
    compileFinalSchema,
    fixturePath,
    listValidationFixtureFiles,
    readFixture,
} = require('./helpers/schema')

const validate = compileFinalSchema()

test.each(listValidationFixtureFiles())('%s validates against the Kirby 5 schema', (relativePath) => {
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
