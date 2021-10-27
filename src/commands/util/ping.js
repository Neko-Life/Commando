const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(ctx) {
		const pingMsg = await ctx.reply('Pinging...');
		return pingMsg.edit({ content: oneLine`
			${ctx.channel.type !== 'dm' ? `${ctx.author},` : ''}
			Pong! The message round-trip took ${
				(pingMsg.editedTimestamp || pingMsg.createdTimestamp) -
				(ctx.message.editedTimestamp || ctx.message.createdTimestamp)
			}ms.
			${this.client.ws.ping ? `The heartbeat ping is ${Math.round(this.client.ws.ping)}ms.` : ''}
		`, allowedMentions: { repliedUser: false } });
	}
};
