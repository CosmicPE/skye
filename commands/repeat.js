const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.repeat(client, message, args);
}

const help = {
	name: 'Repeat',
	description: 'Loops the current queue',
	usage: '~repeat'
}

module.exports = {
	run,
	help
}