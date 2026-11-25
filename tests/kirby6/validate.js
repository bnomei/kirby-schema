const Ajv2020 = require('ajv/dist/2020')
const schema = require('../../kirby6-blueprints.schema.json')

module.exports = new Ajv2020({strictTypes: false, allowMatchingProperties: true}).compile(schema)
