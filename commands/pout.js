const reactions = require('../util/reactions');
const Discord = require('discord.js');

const run = (client, message, args) => {
	let random = Math.floor(Math.random() * reactions.pout.length);
	let embededmessage = new Discord.RichEmbed()
	.setColor('#be92ff')
	.setImage(reactions.pout[random]);
	message.channel.send(embededmessage);
}

module.exports = {
	run
}