const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.clear(client, message, args);
}

const help = {
	name: 'Clear',
	description: 'Clears the current queue of songs',
	usage: '~clear'
}

module.exports = {
	run,
	help
}