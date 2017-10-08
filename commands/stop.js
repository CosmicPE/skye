const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.stop(client, message, args);
}

const help = {
	name: 'Stop',
	description: 'Stop currently playing song',
	usage: '~stop'
}

module.exports = {
	run,
	help
}