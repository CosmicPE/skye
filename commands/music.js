const ytdl = require('ytdl-core');
const fs = require('fs');

const run = (client, message, args) => {
	voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) {
		console.log('User not in voice channel');
	} else {
		voiceChannel.join().then((connection) =>{
			const stream = ytdl('https://www.youtube.com/watch?v=25kqrM3Kct8', {filter: 'audioonly'});
    		//connection.playStream(stream);
			connection.playArbitraryInput('./music/dyrl.mp3');
			//connection.playArbitraryInput('./music/vers.mp3');
			console.log('success');
		}).catch((error) => {
			console.log(error);
		});
	}
}

module.exports = {
	run
}