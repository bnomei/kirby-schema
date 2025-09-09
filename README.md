# Kirby JSON Schema

[![Kirby 3](https://flat.badgen.net/badge/Kirby/3?color=ECC748)](https://getkirby.com)
[![Kirby 4](https://flat.badgen.net/badge/Kirby/4?color=ECC748)](https://getkirby.com)
[![Kirby 5](https://flat.badgen.net/badge/Kirby/5?color=ECC748)](https://getkirby.com)
![Release](https://flat.badgen.net/github/release/bnomei/kirby3-schema?color=ae81ff&icon=github&label)
![Checks](https://flat.badgen.net/github/checks/bnomei/kirby3-schema)
[![Discord](https://flat.badgen.net/badge/discord/bnomei?color=7289da&icon=discord&label)](https://discordapp.com/users/bnomei)
[![Buymecoffee](https://flat.badgen.net/badge/icon/donate?icon=buymeacoffee&color=FF813F&label)](https://www.buymeacoffee.com/bnomei)

JSON Schema file for Kirby blueprints

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
    "/path/to/your/schema/kirby4-blueprints.schema.json": "site/blueprints/**/*.yml"
  }
```

This will automatically use the schema for all blueprint files.

The extension prepends `/` on the path so its `/~/YOUR_FOLDER/kirby3-schema/kirby4-blueprints.schema.json`.

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

## Validate

Check out the test files in the `tests` folder on how to programmatically validate your blueprints with the schema. You can use a similar setup in your CI pipeline.

## Disclaimer

This schema is provided "as is" with no guarantee. Use it at your own risk and always test it yourself before using it in a production environment. If you find any issues, please [create a new issue](https://github.com/bnomei/kirby3-schema/issues/new).

## License

[MIT](https://opensource.org/licenses/MIT)

It is discouraged to use this schema in any project that promotes racism, sexism, homophobia, animal abuse, violence or any other form of hate speech.
