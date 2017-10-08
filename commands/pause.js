const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.pause(client, message, args);
}

const help = {
	name: 'Pause',
	description: 'Pauses the current playing song',
	usage: '~pause'
}

module.exports = {
	run,
	help
}