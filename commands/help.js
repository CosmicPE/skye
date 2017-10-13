const Discord = require('discord.js');

const run = (client, message, args) => {
	if (args.length === 0 ) {
		let embededmessage = new Discord.RichEmbed()
		.setAuthor('The Skyebot command cheatsheet')
		.setThumbnail(client.user.avatarURL)
		.setDescription('All commands are prefixed with a ~ \n\n To see more more in-depth documentation of commands, simply ~help [command] \n\n You can also chat with me by using the mention @Skye if you\'re bored!')
		.addField('Search', 'anime	manga')
		.addField('Reactions', 'lewd	cry	pout	confused	smug')
		.addField('Music', 'play	stop	pause	resume	next	list	clear	remove	shuffle	repeat')
		.setColor('#be92ff');
		message.channel.send(embededmessage);
	} else {
		try {
			let command = require('./' + args[0]);
			let embededmessage = new Discord.RichEmbed()
			.setAuthor(command.help.name)
			.setDescription(command.help.description)
			.addField('Usage', command.help.usage)
			.setColor('#be92ff');
			message.channel.send(embededmessage);
		} catch (error) {
			message.channel.send('Command ' + args[0] + 'not found');
			console.log(error);
		}
	}
}

module.exports = {
	run,
}