const Discord = require('discord.js');
const xml2js = require('xml2js');
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
	let args = message.content.split(' ');

	if (message.content.startsWith(prefix + 'anime')) {
		util.findShow(message, args);
	} else if (message.content.startsWith(prefix + 'food')) {
		message.channel.send('bar');
	}
});

client.login(env.token);