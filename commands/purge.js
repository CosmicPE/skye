const run = (client, message, args) => {
	if (message.channel.permissionsFor(message.author).has('MANAGE_MESSAGES')) {
		if (args.length === 0) {
			message.channel.send('Not enough args for purge');
			console.log('Not enough args for purge');
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
			message.channel.send('Invalid parameters for purge');
			console.log('Invalid parameters for purge');
		}
	} else {
		message.channel.send("You do not have permissions to delete messages");
	}
}

const help = {
	name: 'Purge',
	description: 'Delete x number of messages from current channel. Can also specify who\'s messages to delete',
	usage: '~purge [number of messages] or ~purge [number of messages] [@someone]'
}

module.exports = {
	run,
	help
}