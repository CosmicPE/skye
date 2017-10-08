const search_core = require('../util/search_core');

const run = (client, message, args) => {
	search_core.search('manga', message, args);
}

const help = {
	name: 'Manga',
	description: 'Provides description of a manga',
	usage: '~manga [manga to search]'
}

module.exports = {
	run,
	help
}