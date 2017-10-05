const Discord = require('discord.js');

const purge = (message, args) => {

	if (args === "") {
		console.log('not enough args');
	} else {
		let params = args.split(' ');
		if (params.length === 1) {
			message.channel.fetchMessages({limit: parseInt(params[0]) + 1}).then((messages) => {
				message.channel.bulkDelete(messages);
			});
		} else if (params.length === 2){
			message.channel.fetchMessages({limit: parseInt(params[0]) + 1}).then((messages) => {
				let bulkMessages = [];
				messages.forEach((i) => {
					if (i.author.id === params[1].replace(/@|<|>/g, "")) {
						bulkMessages.push(i);
					}
				});
				message.channel.bulkDelete(bulkMessages);
			});
		} else {
			console.log('Invalid parameters');
		}
	}
}

module.exports = {
	purge
}