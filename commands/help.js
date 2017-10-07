const Discord = require('discord.js');

const run = (client, message, args) => {
	let embededmessage = new Discord.RichEmbed()
	.setAuthor('The Skyebot command cheatsheet')
	.setThumbnail(client.user.avatarURL)
	.setDescription('All commands are prefixed with a ~')
	.addField('Search', 'anime	manga')
	.addField('Reactions', 'lewd	cry	pout	confused	smug')
	.addField('Music', 'play	stop	pause	resume	next')
	.setColor('#be92ff');
	message.channel.send(embededmessage);
}

module.exports = {
	run
}