const Discord = require('discord.js');

const client = new Discord.Client();
const env = require('./env');

client.on('ready', () => {
	console.log('bot coming online....');
	client.user.setGame('Hello world | ~help');
	client.user.setStatus('online');
});

client.on('disconnect', () => {
	console.log('bot has disconnected....');
});

client.on('error', (error) => {
	console.log(error);
});

const prefix = '~';

client.on('message', message => {
	if (!message.content.startsWith(prefix)) return;
	if (message.author.bot) return;

	console.log(message.content.split(' '));
	let args = message.content.split(' ');
	let command = args.shift().slice(1);

	try {
		let cmdFile = require('./commands/' + command);
		cmdFile.run(client, message, args);
	} catch (error) {
		console.log(error);
	}
});

client.login(env.token, () => {console.log(env);});