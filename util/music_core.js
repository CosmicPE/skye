const ytdl = require('ytdl-core');
const fs = require('fs');

const clientQueue = new Map();

const queue = (client, message, args) => {

	let serverQueue = clientQueue.get(message.guild.id);
	let voiceChannel = message.member.voiceChannel;

	if (!voiceChannel) {
		console.log('User not in voice channel');
	} else {
		voiceChannel.join().then((connection) =>{
			ytdl.getInfo(args[0], (error,songInfo) => {

				if (error) {
					console.log(error);
				} else {
					let song = {
						title: songInfo.title,
						url: songInfo.video_url
					}
					if (!serverQueue) {
						const queueConstruct = {
							voiceChannel: voiceChannel,
							connection: connection,
							songs: [],
							playing: false
						}
						queueConstruct.songs.push(song);
						clientQueue.set(message.guild.id, queueConstruct);
						play(message.guild.id, queueConstruct.songs[0]);
					} else {
						serverQueue.songs.push(song);
					}
				}
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}

const play = (guild, song) => {

	let serverQueue = clientQueue.get(guild);
	let voiceChannel = serverQueue.voiceChannel;
	let connection = serverQueue.connection;

	if (!song) {
		voiceChannel.leave();
		clientQueue.delete(guild);
		return;
	}

	let dispatcher = connection.playArbitraryInput(ytdl(song.url));
	dispatcher.setVolume(0.2)
    dispatcher.on('error', (error) => {
        console.log(error);
    });
    dispatcher.on('end', () => {
    	serverQueue.songs.shift();
        play(guild, serverQueue.songs[0])
    });
}

const next = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	serverQueue.connection.dispatcher.end();
}

const stop = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
	clientQueue.delete(message.guild.id);
}

const pause = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	serverQueue.connection.dispatcher.pause();
}

const resume = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	serverQueue.connection.dispatcher.resume();
}

module.exports = {
	queue,
	stop,
	pause,
	resume,
	next
}