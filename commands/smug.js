const reactions = require('../util/reaction_core');

const run = (client, message, args) => {
	message.channel.send(reactions.react('smug'));
}

const help = {
	name: 'Smug',
	description: 'Provides a random picture of a smug reaction',
	usage: '~smug'
}

module.exports = {
	run,
	help
}