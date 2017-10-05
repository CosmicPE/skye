const Discord = require('discord.js');
const client = new Discord.Client();
const env = require('./env.json');
const util = require('./util/anime');

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
		util.findShow(message, args);
	} else if (message.content.startsWith(prefix + 'purge')) {
		let messagecount = parseInt()
	}
});

client.on('messageDelete', message => {
	console.log()
});

client.login(env.token);