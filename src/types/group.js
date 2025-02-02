const ArgumentType = require('./base');
const { disambiguation } = require('../util');
const { escapeMarkdown } = require('../util');

class GroupArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'group', {
			type: 'STRING',
			autocomplete: true
		});
	}

	autocomplete(int) {
		const groups = this.client.registry.findGroups(int.options.getFocused(false));
		return groups.slice(0, 15).map(group => ({ name: group.name, value: group.name }));
	}

	validate(val) {
		const groups = this.client.registry.findGroups(val);
		if(groups.length === 1) return true;
		if(groups.length === 0) return false;
		return groups.length <= 15 ?
			`${disambiguation(groups.map(grp => escapeMarkdown(grp.name)), 'groups', null)}\n` :
			'Multiple groups found. Please be more specific.';
	}

	parse(val) {
		return this.client.registry.findGroups(val)[0];
	}
}

module.exports = GroupArgumentType;
