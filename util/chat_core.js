const Discord = require('discord.js');
const apiai = require('apiai');
const env = require('../env');

let chatbot = apiai(env.apiai_token);

const chat = (client, message, args) => {

	console.log(args.join(' '));
	let request = chatbot.textRequest(args.join(' '), {
	    sessionId: message.author.id
	});
	 
	request.on('response', (response) => {
		message.channel.send(response.result.fulfillment.speech);
	    console.log(response);
	});
	 
	request.on('error', (error) => {
	    console.log(error);
	});

	request.end();
}

module.exports = {
	chat
}
