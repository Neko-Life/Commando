/**
 * @typedef SlashOptions
 * @property {ApplicationCommandOptionType} type - The option type
 * @property {string} [name]
 * @property {string} [description]
 * @property {boolean} [required=false]
 * @property {boolean} [autocomplete=false]
 * @property {{ name: string, value: string | number }[]} [choices]
 * @property {SlashOptions[]} [options] - Additional options when this is a subcommand (group)
 * @property {ChannelType} [channelTypes] - Allowed channel types when this is channel type
 */

/** A type for command arguments */
class ArgumentType {
	/**
	 * @param {CommandoClient} client - The client the argument type is for
	 * @param {string} id - The argument type ID (this is what you specify in {@link ArgumentInfo#type})
	 * @param {SlashOptions} slash - Options for slash commands usage. Omit when not using slash commands.
	 */
	constructor(client, id, slash = null) {
		if(!client) throw new Error('A client must be specified.');
		if(typeof id !== 'string') throw new Error('Argument type ID must be a string.');
		if(id !== id.toLowerCase()) throw new Error('Argument type ID must be lowercase.');

		/**
		 * Client that this argument type is for
		 * @name ArgumentType#client
		 * @type {CommandoClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * ID of this argument type (this is what you specify in {@link ArgumentInfo#type})
		 * @type {string}
		 */
		this.id = id;

		/**
		 * Slash commands options.
		 * @type {SlashOptions}
		 */
		this.slash = slash;
	}

	/**
	 * Runs when there's a request for autocomplete (if it has been enabled in slash options).
	 * @param {AutocompleteInteraction} interaction - The autocomplete interaction from discord.js
	 */
	autocomplete(interaction) { // eslint-disable-line no-unused-vars
		throw new Error(`${this.constructor.name} doesn't have autocomplete method`);
	}

	/**
	 * Runs in slash commands, to convert the value from discord API to the desired value.
	 * @param {any} val -
	 * @returns {any}
	 */
	commandConvert(val) {
		return val;
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 * Validates a value string against the type
	 * @param {string} val - Value to validate
	 * @param {CommandoMessage} msg - Message the value was obtained from
	 * @param {Argument} arg - Argument the value was obtained from
	 * @return {boolean|string|Promise<boolean|string>} Whether the value is valid, or an error message
	 * @abstract
	 */
	validate(val, msg, arg) { // eslint-disable-line no-unused-vars
		throw new Error(`${this.constructor.name} doesn't have a validate() method.`);
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 * Parses the raw value string into a usable value
	 * @param {string} val - Value to parse
	 * @param {CommandoMessage} msg - Message the value was obtained from
	 * @param {Argument} arg - Argument the value was obtained from
	 * @return {*|Promise<*>} Usable value
	 * @abstract
	 */
	parse(val, msg, arg) { // eslint-disable-line no-unused-vars
		throw new Error(`${this.constructor.name} doesn't have a parse() method.`);
	}

	/**
	 * Checks whether a value is considered to be empty. This determines whether the default value for an argument
	 * should be used and changes the response to the user under certain circumstances.
	 * @param {string} val - Value to check for emptiness
	 * @param {CommandoMessage} msg - Message the value was obtained from
	 * @param {Argument} arg - Argument the value was obtained from
	 * @return {boolean} Whether the value is empty
	 */
	isEmpty(val, msg, arg) { // eslint-disable-line no-unused-vars
		if(Array.isArray(val)) return val.length === 0;
		return !val;
	}
}

module.exports = ArgumentType;
