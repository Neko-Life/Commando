const ArgumentType = require('./base');
const { disambiguation } = require('../util');
const { escapeMarkdown } = require('../util');

class CommandArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'command', {
			type: 'STRING',
			autocomplete: true
		});
	}

	commandConvert(val) {
		return this.client.registry.findCommands(val)[0];
	}

	autocomplete(int) {
		const commands = this.client.registry.findCommands(int.options.getFocused(false));
		return commands.slice(0, 25).map(cmd => ({ name: cmd.name, value: `${cmd.groupID}:${cmd.memberName}` }));
	}

	validate(val) {
		const commands = this.client.registry.findCommands(val);
		if(commands.length === 1) return true;
		if(commands.length === 0) return false;
		return commands.length <= 15 ?
			`${disambiguation(commands.map(cmd => escapeMarkdown(cmd.name)), 'commands', null)}\n` :
			'Multiple commands found. Please be more specific.';
	}

	parse(val) {
		return this.client.registry.findCommands(val)[0];
	}
}

module.exports = CommandArgumentType;
