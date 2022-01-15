const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			command: true,
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(ctx) {
		const pingMsg = await ctx.reply('Pinging...');
		return pingMsg.edit({ content: oneLine`
			${ctx.channel.type !== 'DM' ? `${ctx.author},` : ''}
			Pong! The message round-trip took ${
				ctx.message ?
				(pingMsg.editedTimestamp || pingMsg.createdTimestamp) -
				(ctx.message.editedTimestamp || ctx.message.createdTimestamp) :
				pingMsg.createdTimestamp - ctx.interaction.createdTimestamp
			}ms.
			${this.client.ws.ping ? `The heartbeat ping is ${Math.round(this.client.ws.ping)}ms.` : ''}
		`, allowedMentions: { repliedUser: false } });
	}
};
