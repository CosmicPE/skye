const reactions = require('../util/reaction_core');

const run = (client, message, args) => {
	message.channel.send(reactions.react('cry'));
}

const help = {
	name: 'Cry',
	description: 'Provides a random picture of a crying reaction',
	usage: '~cry'
}

module.exports = {
	run,
	help
}