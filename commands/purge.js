const run = (client, message, args) => {
	if (args.length === 0) {
		console.log('not enough args');
	} else if (args.length === 1) {

		message.channel.fetchMessages({limit: parseInt(args[0]) + 1}).then((messages) => {
			message.channel.bulkDelete(messages);
		});
	} else if (args.length === 2) {

		message.channel.fetchMessages({limit: parseInt(args[0]) + 1}).then((messages) => {
			let bulkMessages = [];
			messages.forEach((i) => {
				if (i.author.id === args[1].replace(/@|<|>/g, "")) {
					bulkMessages.push(i);
				}
			});
			message.channel.bulkDelete(bulkMessages);
		});
	} else {
		console.log('Invalid parameters');
	}
}

module.exports = {
	run
}