const Discord = require('discord.js');
const env = require('./env');

const client = new Discord.Client();

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

client.on('message', message => {

	const commandPrefix = env.prefix;
	const prefixMention = '<@' + client.user.id + '>';
	const prefixes = [commandPrefix, prefixMention];
	let prefix;
	prefixes.forEach((thisPrefix) => {
		if (message.content.startsWith(thisPrefix)) {
			prefix = thisPrefix;
		}
	});

	if (!message.content.startsWith(prefix)) return;
	if (message.author.bot) return;

	console.log(message.content.split(' '));
	let args = message.content.split(' ');
	let command = args.shift().slice(1);
	if (prefix === commandPrefix) {
		try {
			let cmdFile = require('./commands/' + command);
			cmdFile.run(client, message, args);
		} catch (error) {
			console.log(error);
		}
	} else {
		try {
			let chat_core = require('./util/chat_core');
			chat_core.chat(client, message, args);
		} catch (error) {
			console.log(error);
		}
	}
});

client.login(env.token, (result) => {
	console.log(result);
});