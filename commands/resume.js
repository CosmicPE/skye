const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.resume(client, message, args);
}

module.exports = {
	run
}