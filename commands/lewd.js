const reactions = require('../util/reaction_core');

const run = (client, message, args) => {
	message.channel.send(reactions.react('lewd'));
}

const help = {
	name: 'Lewd',
	description: 'Provides a random picture of reaction to something lewd',
	usage: '~lewd'
}

module.exports = {
	run,
	help
}