const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.resume(client, message, args);
}

const help = {
	name: 'Resume',
	description: 'Resume currently playing song',
	usage: '~resume'
}

module.exports = {
	run,
	help
}