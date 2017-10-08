const reactions = require('../util/reaction_core');

const run = (client, message, args) => {
	message.channel.send(reactions.react('pout'));
}

const help = {
	name: 'Pout',
	description: 'Provides a random picture of a pout',
	usage: '~pout'
}

module.exports = {
	run,
	help
}