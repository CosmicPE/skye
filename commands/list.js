const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.list(client, message, args);
}

const help = {
	name: 'List',
	description: 'Lists current songs in queue',
	usage: '~list'
}

module.exports = {
	run,
	help
}