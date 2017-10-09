const ytdl = require('ytdl-core');

const clientQueue = new Map();

const queue = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	let voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) {
		message.channel.send('User not in voice channel');
		console.log('User not in voice channel');
	} else {
		ytdl.getInfo(args[0], (error,songInfo) => {
			if (error) {
				message.channel.send('Unable to play video');
				console.log(error);
			} else {
				let song = {
					title: songInfo.title,
					url: songInfo.video_url
				}
				if (!serverQueue) {
					voiceChannel.join().then((connection) => {
						const queueConstruct = {
							voiceChannel: voiceChannel,
							connection: connection,
							songs: [],
							playing: false
						}
						queueConstruct.songs.push(song);
						clientQueue.set(message.guild.id, queueConstruct);
						play(client, message.guild.id, queueConstruct.songs[0]);
					}).catch((error) => {
						message.channel.send('Unable to join voice channel');
						console.log(error);
					});
				} else {
					message.channel.send(song.title + ' added to the queue');
					serverQueue.songs.push(song);
				}
			}
		});
	}
}

const play = (client, guild, song) => {
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
        play(client, guild, serverQueue.songs[0])
    });
}

const next = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (!serverQueue) {
		message.channel.send('There is no song currently playing on this server');
		console.log('There is no song currently playing on this server');
	} else {
		serverQueue.connection.dispatcher.end();
	}
}

const stop = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (!serverQueue) {
		message.channel.send('There is no song currently playing on this server');
		console.log('There is no song currently playing on this server');
	} else {
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		clientQueue.delete(message.guild.id);
	}
}

const pause = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (!serverQueue) {
		message.channel.send('There is no song currently playing on this server');
		console.log('There is no song currently playing on this server');
	} else {
		serverQueue.connection.dispatcher.pause();
	}
}

const resume = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (!serverQueue) {
		message.channel.send('There is no song currently playing on this server');
		console.log('There is no song currently playing on this server');
	} else {
		serverQueue.connection.dispatcher.resume();
	}
}

const list = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (!serverQueue) {
		message.channel.send('There is no song currently playing on this server');
		console.log('There is no song currently playing on this server');
	} else {
		console.log(serverQueue.songs.title);
		let song_array = [];
		let i = 0;
		serverQueue.songs.forEach((song) => {
			song_array.push('[' + i + '] ' + song.title + '\n');
			i++;
		});
		message.channel.send('**Current songs in queue**');
		message.channel.send(('```css\n' + song_array + '\n```').replace(/,/g, ""));
	}
}

module.exports = {
	queue,
	stop,
	pause,
	resume,
	next,
	list
}