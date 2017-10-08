const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.next(client, message, args);
}

const help = {
	name: 'Next',
	description: 'Plays next song in song queue',
	usage: '~next'
}

module.exports = {
	run,
	help
}