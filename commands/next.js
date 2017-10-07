const music_core = require('../util/music_core');

const run = (client, message, args) => {
	music_core.next(client, message, args);
}

module.exports = {
	run
}