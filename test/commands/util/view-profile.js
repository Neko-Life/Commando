const stripIndents = require('common-tags').stripIndents;
const commando = require('../../../src');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'view-profile',
			group: 'util',
			memberName: 'view-profile',
			description: '',
			guildOnly: true,
			command: 'user'
		});
	}

	async run(ctx) {
		const member = ctx.targetMember;
		const user = ctx.targetUser;
		return ctx.reply(stripIndents`
			Info on **${user.username}#${user.discriminator}** (ID: ${user.id})

			**❯ Member Details**
			${member.nickname !== null ? ` • Nickname: ${member.nickname}` : ' • No nickname'}
			 • Roles: ${member.roles.cache.map(roles => `\`${roles.name}\``).join(', ')}
			 • Joined at: ${member.joinedAt}

			**❯ User Details**
			 • Created at: ${user.createdAt}${user.bot ? '\n • Is a bot account' : ''}
			 • Status: ${user.presence.status}
			 • Game: ${user.presence.game ? user.presence.game.name : 'None'}
		`);
	}
};
