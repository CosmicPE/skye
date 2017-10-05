const Discord = require('discord.js');
const client = new Discord.Client();
const env = require('./env.json');
const anime_module = require('./util/anime');
const purge_module = require('./util/purge');

client.on('ready', () => {
	console.log('bot coming online....');
	client.user.setGame('Hello world');
	client.user.setStatus('online');
});

const prefix = '~';

client.on('message', message => {
	if (!message.content.startsWith(prefix)) return;
	if (message.author.bot) return;

	console.log(message.content.split(' '));
	let args = message.content.split(' ').slice(1).join(' ');

	if (message.content.startsWith(prefix + 'anime')) {
		anime_module.findShow(message, args);
	} else if (message.content.startsWith(prefix + 'purge')) {
		purge_module.purge(message, args);
	} else if (message.content.startsWith(prefix + 'help')) {

	}
});

client.login(env.token);