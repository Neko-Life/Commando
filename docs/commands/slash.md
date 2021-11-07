# Slash commands

Slash commands are now supported in Commando. There are, however, number of changes (and downgrades).

## Known limitations

* Global commands take an hour to spread out. When working on the bot, use guild registration instead, as these are nearly instant.
* There's a limit of 100 global commands. Commando currently doesn't support mixing guild and global commands, so you can't take advantage of 100 per-guild commands.
* There's a limit of 5 user menu commands, and 5 message menu commands.
* Bots still need the message intent, so that Commando can ask for clarification.
* Types need changes. Default commando types already support slash commands, but if you're using custom commands, you might need to change that.
