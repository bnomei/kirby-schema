# Kirby JSON Schema

[![Kirby 3](https://flat.badgen.net/badge/Kirby/3?color=ECC748)](https://getkirby.com)
[![Kirby 4](https://flat.badgen.net/badge/Kirby/4?color=ECC748)](https://getkirby.com)
[![Kirby 5](https://flat.badgen.net/badge/Kirby/5?color=ECC748)](https://getkirby.com)
![Release](https://flat.badgen.net/github/release/bnomei/kirby3-schema?color=ae81ff&icon=github&label)
![Checks](https://flat.badgen.net/github/checks/bnomei/kirby3-schema)
[![Discord](https://flat.badgen.net/badge/discord/bnomei?color=7289da&icon=discord&label)](https://discordapp.com/users/bnomei)
[![Buymecoffee](https://flat.badgen.net/badge/icon/donate?icon=buymeacoffee&color=FF813F&label)](https://www.buymeacoffee.com/bnomei)

JSON Schema file for Kirby blueprints

## Version Support

Kirby 5 is the active schema target. New docs-parity fixes, fixture updates and refactor work target `kirby5-blueprints.schema.json`.

The Kirby 3 and Kirby 4 schemas remain downloadable as frozen legacy artifacts, but they do not receive new docs-parity fixes or refactor work.

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
    "/path/to/your/schema/kirby5-blueprints.schema.json": "site/blueprints/**/*.yml"
  }
```

or via an URL (thanks @janstuemmel)

```yaml
  "yaml.schemas": { 
    "https://raw.githubusercontent.com/bnomei/kirby-schema/refs/heads/main/kirby5-blueprints.schema.json": "site/blueprints/**/*.yml" 
}
```

This will automatically use the schema for all blueprint files.

The extension prepends `/` on the path so its `/~/YOUR_FOLDER/kirby3-schema/kirby5-blueprints.schema.json`.

> [!NOTE]
> thanks @tobimori and @iskrisis

### PHPStorm

Clone this repo to your local machine. Open the IDE settings and search for `JSON Schema`. Then select `Languages & Frameworks` » `Schemas and DTDs` » `JSON Schema Mappings`. Click the `+` button at the top to add a new JSON validate configuration. Then, fill in the corresponding name, file or URL, and version.

For testing, I mapped it to my `site/blueprints` folder.

### Sublime Text

You can use the schema in Sublime Text by cloning this repo to your local machine and setting a custom JSON schema location using [this Sublime Text extension](https://github.com/sublimelsp/LSP-json?tab=readme-ov-file#custom-schemas]) and wildcards in `fileMatch` [schema settings](https://github.com/sublimelsp/LSP-yaml/blob/7b928a7b84f25381b01fa98c04ca7b1418b3a465/LSP-yaml.sublime-settings#L37) ([more](https://github.com/sublimelsp/LSP-json?tab=readme-ov-file#custom-schemas)).

## Blueprint detection

Since Kirby reuses some types like `file`, `info`, `pages` in fields and sections the schema cannot always determine which blueprint you are working on with absolute certainty. For now, I introduced a `blueprint` property to solve this. Use it in your `block`, `field`, `file`, `page`, `section`, `site`, `tab` and `user` blueprints.  

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
> Adding the `blueprint` property does not affect Kirby in any way. It is just a hint for your IDE. It's safe to share such blueprints with colleagues that do not have the schema installed.

## Known Limitations

### Extends - Here be Dragons

The `extends` property on blueprint definitions is an edge case for the schema. The schema is a pattern matcher at heart, and it cannot validate what you are extending from in inspecting referenced files. There is no way that I am aware of to make `extends` play nice. For that reason I decided to have the schema surface an error instead of muting/hiding the inability to validate that part of the blueprint.

## What v5.4.0 Is About

v5.4.0 is not just a version bump. It is a Kirby 5 schema parity release.

The schema was audited against Kirby 5's upstream blueprint, field, section and Panel code. The main goal was to reduce false errors in IDEs for blueprint shapes that Kirby 5 really accepts, while also rejecting shapes that were only accepted by this schema by accident.

Highlights:

- `kirby5-blueprints.schema.json` is now generated from smaller source files in `schema/kirby5/**`.
- The test suite now validates canonical fixtures, official docs examples, Starterkit blueprints, reusable shape variants and pinned property manifests.
- The current test suite covers 1742 tests.
- Kirby 5-only support was expanded for translated labels/text, richer `options` forms, query/API option providers, fieldset shorthands, optional column widths, blueprint buttons, page preset inputs, boolean blueprint `options`/`permissions`, file `accept: true` and additional field properties.
- Over-accepted shapes were tightened for picker and section `query`/`search`, files/pages sections, `link.options`, `headline.numbered`, stats sizes and numeric `step` values.
- Known defaults were corrected for `date.calendar`, `textarea.spellcheck`, `files.multiple` and `structure.prepend`.

In short: v5.4.0 makes the Kirby 5 schema more faithful to Kirby itself. It does not try to model dynamic behavior such as `extends` resolution, plugin-defined fields/sections or runtime blueprint mutations.

## Validate

Check out the test files in the `tests` folder on how to programmatically validate your blueprints with the schema. You can use a similar setup in your CI pipeline.

## Disclaimer

This schema is provided "as is" with no guarantee. Use it at your own risk and always test it yourself before using it in a production environment. If you find any issues, please [create a new issue](https://github.com/bnomei/kirby3-schema/issues/new).

## License

[MIT](https://opensource.org/licenses/MIT)

It is discouraged to use this schema in any project that promotes racism, sexism, homophobia, animal abuse, violence or any other form of hate speech.
