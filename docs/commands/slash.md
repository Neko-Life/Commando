# Slash commands

Slash commands are now supported in Commando. There are, however, number of changes (and downgrades).

## Known limitations

* Global commands take an hour to spread out. When working on the bot, use guild registration instead, as these are nearly instant.
* There's a limit of 100 global commands. Commando currently doesn't support mixing guild and global commands, so you can't take advantage of 100 per-guild commands.
* There's a limit of 5 user menu commands, and 5 message menu commands.
* Bots still need the message intent, so that Commando can ask for clarification.
* Types need changes. Default commando types already support slash commands, but if you're using custom commands, you might need to change that.
* Union arguments are not supported.

## Defining types

There are 2 changes for slash command-compatible types:

The first one is the third option for the `super` call in constructor. The types need at least the `type` to be set to one of the [Discord slash command types](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type). Subcommands are supported through the `options` property.

```js
constructor(client) {
    super(client, "example", {
        type: "STRING"
    });
}
```

See the [documentation for SlashOptions](#docs/commando/next/typedefs/SlashOptions) for the docs about this object.

Autocomplete is supported, by setting the `autocomplete: true` in the SlashOption object, and then adding an `autocomplete` method to the type. It takes an interaction, and should return an array of objects `{ name: string, value: string }`.

The second change that's required for types is `commandConvert`, which takes the Discord object (like `user` for `USER` type) and should return what the types `parse`r is supposed to return. When using slash commands, types `parse` and `validate` are skipped.

## Defining commands

Commands should, in a perfect world, require just adding `interactions: [{ type: "slash" }]` to their definitions.

In reality, you might be using custom types, and may not be used to working with Context.

### Base definition

Just add `command: "slash"` (or it's shorthand format, `command: true`) to their definition. All other fields should be autocompleted by commando correctly.

Setting a different name, different description or using a space in command name is currently not supported in Commando.

If you want to have it used as just a command (may be useful for example with message menus), add `commandOnly: true` which prevents the default handling triggering the command (with prefix, ping or in DM). Patterns will still trigger the command though.

## Context

Context is a special object that's passed by Commando to commands instead of Message. This makes Commands more portable by default between slash commands and normal message commands. Preffered abbreviation is `ctx`, but you're free to use whatever you use.

It can be obtained using `Context.extend(message)` (for use within services or custom message handlers). Extenders are cached, so that calls to extend the same message will return the same object (although the Contexts are garbage collected along with Messages).

Context contains shared fields between message and interactions.

See the [documentation for Context](#docs/commando/next/class/Context) for more info about what it contains.

<info>Since discord.js no longer supports structures, Commando can't extend Message or Guild. To get the CommandoGuild for settings, use `contextGuild` on `Context`, or use `CommandoGuild.extend(guild)`.</info>
