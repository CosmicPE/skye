const ytdl = require('ytdl-core');
const fs = require('fs');

const play = (client, message, args) => {
	voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) {
		console.log('User not in voice channel');
	} else {
		voiceChannel.join().then((connection) =>{
			let stream = ytdl('https://www.youtube.com/watch?v=25kqrM3Kct8', {filter: 'audioonly'});
    		let dispatcher = connection.playStream(stream);

			//connection.playArbitraryInput('./music/dyrl.mp3');
			//let dispatcher = connection.playArbitraryInput('./music/vers.mp3');
			console.log(dispatcher.stream);
			console.log('success');
		}).catch((error) => {
			console.log(error);
		});
	}
}

const stop = (client, message, args) => {
	client.voiceConnections.forEach((connection) => {
		if (connection.channel.guild.id === message.guild.id) {
			connection.dispatcher.end();
		}
	});
}

const pause = (client, message, args) => {
	client.voiceConnections.forEach((connection) => {
		if (connection.channel.guild.id === message.guild.id) {
			connection.dispatcher.pause();
		}
	});
}

const resume = (client, message, args) => {
	client.voiceConnections.forEach((connection) => {
		if (connection.channel.guild.id === message.guild.id) {
			connection.dispatcher.debug
			connection.dispatcher.resume();
		}
	});
}

module.exports = {
	play,
	stop,
	pause,
	resume
}