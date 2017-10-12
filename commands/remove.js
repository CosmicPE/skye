const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.remove(client, message, args);
}

const help = {
	name: 'Remove',
	description: 'Remove a song from the queue',
	usage: '~remove [number]'
}

module.exports = {
	run,
	help
}