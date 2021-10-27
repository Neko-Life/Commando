const Command = require('../commands/base');
const GuildSettingsHelper = require('../providers/helper');

const cache = new WeakMap();
/* eslint-disable capitalized-comments */

/**
 * A fancier Guild for fancier people.
 * @extends Guild
 */
module.exports = class CommandoGuild {
	constructor(guild) {
		this.guild = guild;
		this.client = this.guild.client;
		/**
		 * Shortcut to use setting provider methods for this guild
		 * @type {GuildSettingsHelper}
		 */
		this.settings = new GuildSettingsHelper(this.client, guild);

		/**
		 * Internal command prefix for the guild, controlled by the {@link CommandoGuild#commandPrefix}
		 * getter/setter
		 * @name CommandoGuild#_commandPrefix
		 * @type {?string}
		 * @private
		 */
		this._commandPrefix = null;
	}

	// get afkChannel() { return this.guild.afkChannel; }
	// get afkChannelId() { return this.guild.afkChannelId; }
	// get afkTimeout() { return this.guild.afkTimeout; }
	// get applicationId() { return this.guild.applicationId; }
	// get approximateMemberCount() { return this.guild.approximateMemberCount; }
	// get approximatePresenceCount() { return this.guild.approximatePresenceCount; }
	// get available() { return this.guild.available; }
	// get banner() { return this.guild.banner; }
	// get bans() { return this.guild.bans; }
	// get channels() { return this.guild.channels; }
	// get commands() { return this.guild.commands; }
	// get createdAt() { return this.guild.createdAt; }
	// get createdTimestamp() { return this.guild.createdTimestamp; }
	// get defaultMessageNotifications() { return this.guild.defaultMessageNotifications; }
	// get deleted() { return this.guild.deleted; }
	// get description() { return this.guild.description; }
	// get discoverySplash() { return this.guild.discoverySplash; }
	// get emojis() { return this.guild.emojis; }
	// get explicitContentFilter() { return this.guild.explicitContentFilter; }
	// get features() { return this.guild.features; }
	// get icon() { return this.guild.icon; }
	// get id() { return this.guild.id; }
	// get invites() { return this.guild.invites; }
	// get joinedAt() { return this.guild.joinedAt; }
	// get joinedtimestamp() { return this.guild.joinedtimestamp; }
	// get large() { return this.guild.large; }
	// get maximumBitrate() { return this.guild.maximumBitrate; }
	// get maximumMembers() { return this.guild.maximumMembers; }
	// get maximumPresences() { return this.guild.maximumPresences; }
	// get me() { return this.guild.me; }
	// get memberCount() { return this.guild.memberCount; }
	// get members() { return this.guild.members; }
	// get mfaLevel() { return this.guild.mfaLevel; }
	// get name() { return this.guild.name; }
	// get nameAcronym() { return this.guild.nameAcronym; }
	// get nsfwLevel() { return this.guild.nsfwLevel; }
	// get ownerId() { return this.guild.ownerId; }
	// get partnered() { return this.guild.partnered; }
	// get preferredLocale() { return this.guild.preferredLocale; }
	// get premiumSubscriptionCount() { return this.guild.premiumSubscriptionCount; }
	// get premiumTier() { return this.guild.premiumTier; }
	// get presences() { return this.guild.presences; }
	// get publicUpdatesChannel() { return this.guild.publicUpdatesChannel; }
	// get publicUpdatesChannelId() { return this.guild.publicUpdatesChannelId; }
	// get roles() { return this.guild.roles; }
	// get rulesChannel() { return this.guild.rulesChannel; }
	// get ruleschannelId() { return this.guild.ruleschannelId; }
	// get shard() { return this.guild.shard; }
	// get shardId() { return this.guild.shardId; }
	// get splash() { return this.guild.splash; }
	// get stageInstances() { return this.guild.stageInstances; }
	// get stickers() { return this.guild.stickers; }
	// get systemChannel() { return this.guild.systemChannel; }
	// get systemChannelFlags() { return this.guild.systemChannelFlags; }
	// get systemChannelId() { return this.guild.systemChannelId; }
	// get vanityURLCode() { return this.guild.vanityURLCode; }
	// get vanityURLUses() { return this.guild.vanityURLUses; }
	// get verificationLevel() { return this.guild.verificationLevel; }
	// get verified() { return this.guild.verified; }
	// get voiceAdapterCreator() { return this.guild.voiceAdapterCreator; }
	// get voiceStates() { return this.guild.voiceStates; }
	// get widgetChannel() { return this.guild.widgetChannel; }
	// get widgetChannelId() { return this.guild.widgetChannelId; }
	// get widgetEnabled() { return this.guild.widgetEnabled; }

	// iconURL(data) { return this.guild.iconURL(data); }

	/**
	 * Extends the set guild, reuses from cache.
	 * @param {Guild} guild - the guild to extend
	 * @returns {CommandoGuild}
	 */
	static extend(guild) {
		if(cache.has(guild)) return cache.get(guild);
		const extended = new CommandoGuild(guild);
		cache.set(guild, extended);
		return extended;
	}

	/**
	 * Command prefix in the guild. An empty string indicates that there is no prefix, and only mentions will be used.
	 * Setting to `null` means that the prefix from {@link CommandoClient#commandPrefix} will be used instead.
	 * @type {string}
	 * @emits {@link CommandoClient#commandPrefixChange}
	 */
	get commandPrefix() {
		if(this._commandPrefix === null) return this.client.commandPrefix;
		return this._commandPrefix;
	}

	set commandPrefix(prefix) {
		this._commandPrefix = prefix;
		/**
		 * Emitted whenever a guild's command prefix is changed
		 * @event CommandoClient#commandPrefixChange
		 * @param {?CommandoGuild} guild - Guild that the prefix was changed in (null for global)
		 * @param {?string} prefix - New command prefix (null for default)
		 */
		this.client.emit('commandPrefixChange', this, this._commandPrefix);
	}

	/**
	 * Sets whether a command is enabled in the guild
	 * @param {CommandResolvable} command - Command to set status of
	 * @param {boolean} enabled - Whether the command should be enabled
	 */
	setCommandEnabled(command, enabled) {
		command = this.client.registry.resolveCommand(command);
		if(command.guarded) throw new Error('The command is guarded.');
		if(typeof enabled === 'undefined') throw new TypeError('Enabled must not be undefined.');
		enabled = Boolean(enabled);
		if(!this._commandsEnabled) {
			/**
			 * Map object of internal command statuses, mapped by command name
			 * @type {Object}
			 * @private
			 */
			this._commandsEnabled = {};
		}
		this._commandsEnabled[command.name] = enabled;
		/**
		 * Emitted whenever a command is enabled/disabled in a guild
		 * @event CommandoClient#commandStatusChange
		 * @param {?CommandoGuild} guild - Guild that the command was enabled/disabled in (null for global)
		 * @param {Command} command - Command that was enabled/disabled
		 * @param {boolean} enabled - Whether the command is enabled
		 */
		this.client.emit('commandStatusChange', this, command, enabled);
	}

	/**
	 * Checks whether a command is enabled in the guild (does not take the command's group status into account)
	 * @param {CommandResolvable} command - Command to check status of
	 * @return {boolean}
	 */
	isCommandEnabled(command) {
		command = this.client.registry.resolveCommand(command);
		if(command.guarded) return true;
		if(!this._commandsEnabled || typeof this._commandsEnabled[command.name] === 'undefined') {
			return command._globalEnabled;
		}
		return this._commandsEnabled[command.name];
	}

	/**
	 * Sets whether a command group is enabled in the guild
	 * @param {CommandGroupResolvable} group - Group to set status of
	 * @param {boolean} enabled - Whether the group should be enabled
	 */
	setGroupEnabled(group, enabled) {
		group = this.client.registry.resolveGroup(group);
		if(group.guarded) throw new Error('The group is guarded.');
		if(typeof enabled === 'undefined') throw new TypeError('Enabled must not be undefined.');
		enabled = Boolean(enabled);
		if(!this._groupsEnabled) {
			/**
			 * Internal map object of group statuses, mapped by group ID
			 * @type {Object}
			 * @private
			 */
			this._groupsEnabled = {};
		}
		this._groupsEnabled[group.id] = enabled;
		/**
		 * Emitted whenever a command group is enabled/disabled in a guild
		 * @event CommandoClient#groupStatusChange
		 * @param {?CommandoGuild} guild - Guild that the group was enabled/disabled in (null for global)
		 * @param {CommandGroup} group - Group that was enabled/disabled
		 * @param {boolean} enabled - Whether the group is enabled
		 */
		this.client.emit('groupStatusChange', this, group, enabled);
	}

	/**
	 * Checks whether a command group is enabled in the guild
	 * @param {CommandGroupResolvable} group - Group to check status of
	 * @return {boolean}
	 */
	isGroupEnabled(group) {
		group = this.client.registry.resolveGroup(group);
		if(group.guarded) return true;
		if(!this._groupsEnabled || typeof this._groupsEnabled[group.id] === 'undefined') return group._globalEnabled;
		return this._groupsEnabled[group.id];
	}

	/**
	 * Creates a command usage string using the guild's prefix
	 * @param {string} [command] - A command + arg string
	 * @param {User} [user=this.client.user] - User to use for the mention command format
	 * @return {string}
	 */
	commandUsage(command, user = this.client.user) {
		return Command.usage(command, this.commandPrefix, user);
	}
};
