const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.shuffle(client, message, args);
}

const help = {
	name: 'Shuffle',
	description: 'Shuffle currently queue',
	usage: '~shuffle'
}

module.exports = {
	run,
	help
}