const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.queue(client, message, args);
}

const help = {
	name: 'Play',
	description: 'Plays a song from YouTube. If a song is already playing, adds it to the queue',
	usage: '~play [youtube video url]'
}

module.exports = {
	run,
	help
}