const reactions = require('../util/reaction_core');

const run = (client, message, args) => {
	message.channel.send(reactions.react('confused'));
}

const help = {
	name: 'confused',
	description: 'Provides a random picture of a confused reaction',
	usage: '~confused'
}

module.exports = {
	run,
	help
}