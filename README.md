# Kirby JSON Schema

[![Kirby 3](https://flat.badgen.net/badge/Kirby/3?color=ECC748)](https://getkirby.com)
[![Kirby 4](https://flat.badgen.net/badge/Kirby/4?color=ECC748)](https://getkirby.com)
[![Kirby 5](https://flat.badgen.net/badge/Kirby/5?color=ECC748)](https://getkirby.com)
[![Kirby 6](https://flat.badgen.net/badge/Kirby/6?color=ECC748)](https://getkirby.com/releases/6)
![Release](https://flat.badgen.net/github/release/bnomei/kirby3-schema?color=ae81ff&icon=github&label)
![Checks](https://flat.badgen.net/github/checks/bnomei/kirby3-schema)
[![Discord](https://flat.badgen.net/badge/discord/bnomei?color=7289da&icon=discord&label)](https://discordapp.com/users/bnomei)
[![Buymecoffee](https://flat.badgen.net/badge/icon/donate?icon=buymeacoffee&color=FF813F&label)](https://www.buymeacoffee.com/bnomei)

JSON Schema file for Kirby blueprints

## Version Support

**Kirby 6 is the only active target.** Use [kirby6-blueprints.schema.json](kirby6-blueprints.schema.json) for Kirby 6 projects. To contribute, edit `schema/kirby6/`, run `npm run build:schema`, then `npm test`.

The Kirby 3, 4 and 5 schema files remain available at their original URLs, frozen for projects using those versions.

The v6 schema follows the [stable changelog](https://getkirby.com/releases/6/changelog). It accepts root field definitions referenced by name from tabs and columns, the new list and picker fields, and the buttons field. Existing built-in sections (`fields`, `pages`, `files`, `info`, `stats`) and the `pages`, `files` and `users` picker aliases still work. Removed presets, custom sections, `rawvalues` and separate `api`/`query` providers on choice fields are not supported. See [Kirby’s blueprint migration guide](https://getkirby.com/releases/6/blueprints) for replacements.

## Install

### Schemastore (not yet)

Ideally, this repo's schema would be available from the [Schemastore](https://www.schemastore.org/json/), and there would be almost zero configuration in most IDEs. But that is something the Kirby CMS team should eventually do, not me.

### Download the Schema

You can clone the entire repo or download the file `kirbyX-blueprints.schema.json`, where `X` matches your intended Kirby version. Put that file inside your project or in a global space of your dev setup. Then configure your IDE to use that file to get Schema information for Kirby's blueprints.

## Configure your IDE

### VSCode

You will need the [Red Hat VS Code YAML Extension](https://github.com/redhat-developer/vscode-yaml), and then you can use the `yaml.schemas` setting to add your schema like this:

```yaml
  "yaml.schemas": {
    "/path/to/your/schema/kirby6-blueprints.schema.json": "site/blueprints/**/*.yml"
  }
```

or via an URL (thanks @janstuemmel)

```yaml
  "yaml.schemas": { 
    "https://raw.githubusercontent.com/bnomei/kirby-schema/refs/heads/main/kirby6-blueprints.schema.json": "site/blueprints/**/*.yml"
}
```

This will automatically use the schema for all blueprint files.

The extension prepends `/` on the path so its `/~/YOUR_FOLDER/kirby3-schema/kirby6-blueprints.schema.json`.

> [!NOTE]
> thanks @tobimori and @iskrisis

### PHPStorm

Clone this repo to your local machine. Open the IDE settings and search for `JSON Schema`. Then select `Languages & Frameworks` » `Schemas and DTDs` » `JSON Schema Mappings`. Click the `+` button at the top to add a new JSON validate configuration. Then, fill in the corresponding name, file or URL, and version.

For testing, I mapped it to my `site/blueprints` folder.

### Sublime Text

You can use the schema in Sublime Text by cloning this repo to your local machine and setting a custom JSON schema location using [this Sublime Text extension](https://github.com/sublimelsp/LSP-json?tab=readme-ov-file#custom-schemas]) and wildcards in `fileMatch` [schema settings](https://github.com/sublimelsp/LSP-yaml/blob/7b928a7b84f25381b01fa98c04ca7b1418b3a465/LSP-yaml.sublime-settings#L37) ([more](https://github.com/sublimelsp/LSP-json?tab=readme-ov-file#custom-schemas)).

## Blueprint detection

Kirby 6 blueprints do not need a `blueprint` hint. If two kinds share the same shape, an optional hint such as `blueprint: page` narrows the IDE suggestions.

```diff
+ blueprint: site

title: My Site Blueprint

fields:
  text:
    type: text
```

```diff
+ blueprint: page

title: My Page Blueprint

fields:
  text:
    type: text
```

> [!IMPORTANT]
> Do not add an IDE hint to a `filelist` field or a legacy `files` section: `blueprint: image` there selects a real Kirby file blueprint. The same applies to `uploads.blueprint`.

## Known Limitations

The schema checks the shape of field references, not whether a name exists in the current blueprint or collides with a field in another tab. Kirby resolves names, queries, permissions and plugin extensions at runtime.

### Extends - Here be Dragons

The `extends` property on blueprint definitions is an edge case for the schema. The schema is a pattern matcher at heart, and it cannot validate what you are extending from in inspecting referenced files. There is no way that I am aware of to make `extends` play nice. For that reason I decided to have the schema surface an error instead of muting/hiding the inability to validate that part of the blueprint.

## Validate

See [the Kirby 6 validator](tests/kirby6/validate.js) for an example of compiling the downloadable schema with Ajv. Use it with parsed YAML in your own CI pipeline.

## Disclaimer

This schema is provided "as is" with no guarantee. Use it at your own risk and always test it yourself before using it in a production environment. If you find any issues, please [create a new issue](https://github.com/bnomei/kirby3-schema/issues/new).

## License

[MIT](https://opensource.org/licenses/MIT)

It is discouraged to use this schema in any project that promotes racism, sexism, homophobia, animal abuse, violence or any other form of hate speech.
