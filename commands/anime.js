const search_core = require('../util/search_core');

const run = (client, message, args) => {
	search_core.search('anime', message, args);
}

const help = {
	name: 'Anime',
	description: 'Provides description of an anime',
	usage: '~anime [anime to search]'
}

module.exports = {
	run,
	help
}