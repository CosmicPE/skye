const ytdl = require('ytdl-core');
const Discord = require('discord.js');

const clientQueue = new Map();

const queue = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	let voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) {
		message.channel.send('User not in voice channel');
	} else {
		ytdl.getInfo(args[0], (error,songInfo) => {
			if (error) {
				message.channel.send('Unable to play video');
				console.log(error);
			} else {
				let song = {
					title: songInfo.title,
					url: songInfo.video_url,
					queued_by: message.author
				}
				if (!serverQueue) {
					voiceChannel.join().then((connection) => {
						const queueConstruct = {
							voiceChannel: voiceChannel,
							connection: connection,
							songs: [],
							repeat: false,
							playing: false
						}
						queueConstruct.songs.push(song);
						clientQueue.set(message.guild.id, queueConstruct);
						play(message, message.guild.id, queueConstruct.songs[0]);
					}).catch((error) => {
						message.channel.send('Unable to join voice channel');
						console.log(error);
					});
				} else {
					message.channel.send(song.title + ' added to the queue');
					serverQueue.songs.push(song);
					list(client, message, args);
				}
			}
		});
	}
}

const play = (message, guild, song) => {
	let serverQueue = clientQueue.get(guild);
	let voiceChannel = serverQueue.voiceChannel;
	let connection = serverQueue.connection;
	serverQueue.songs.shift();
	if (!song) {
		voiceChannel.leave();
		clientQueue.delete(guild);
		return;
	}
	let dispatcher = connection.playArbitraryInput(ytdl(song.url));
	serverQueue.playing = true;
	let embededmessage = new Discord.RichEmbed()
	.setColor('be92ff')
	.setTitle(':headphones: Now Playing')
	.setDescription('[' + song.title + ']' + '(' + song.url + ')' + '\nQueued By ' + song.queued_by);
	message.channel.send(embededmessage);
	dispatcher.setVolume(0.2);
    dispatcher.on('error', (error) => {
    	message.channel.send('Unable to play ' + song.title);
        console.log(error);
    });
    dispatcher.on('end', (reason) => {
		if (serverQueue.repeat) {
	    	serverQueue.songs.push(song);
	    }
	    play(message, guild, serverQueue.songs[0]);
    });
}

const next = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		serverQueue.connection.dispatcher.end();
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

const stop = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		serverQueue.songs = [];
		serverQueue.repeat = false;
		serverQueue.connection.dispatcher.end();
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

const pause = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		serverQueue.connection.dispatcher.pause();
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

const resume = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		serverQueue.connection.dispatcher.resume();
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

const list = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		let song_array = [];
		let i = 0;
		serverQueue.songs.forEach((song) => {
			song_array.push('[' + i + '] ' + song.title + '\n');
			i++;
		});
		if (song_array.length) {
			message.channel.send('**Current songs in queue**');
			message.channel.send(('```css\n' + song_array + '\n```').replace(/,/g, ""));
		} else {
			let embededmessage = new Discord.RichEmbed()
			.setColor('be92ff')
			.setDescription('There are currently no songs in the queue');
			message.channel.send(embededmessage);
		}
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

const clear = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		if (serverQueue.songs.length) {
			serverQueue.songs = [];
			let embededmessage = new Discord.RichEmbed()
			.setColor('be92ff')
			.setDescription('Queue has been cleared by ' + message.author);
			message.channel.send(embededmessage);
		} else {
			message.channel.send('There are currently no songs in the queue');
		}
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

const remove = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (args.length === 1) {
		if (serverQueue) {
			let song_number = parseInt(args[0], 10);
			console.log(song_number);
			if (song_number <= serverQueue.songs.length - 1 && song_number >= 0) {
				let song = serverQueue.songs[song_number].title;
				serverQueue.songs.splice(song_number, 1);
				let embededmessage = new Discord.RichEmbed()
				.setColor('be92ff')
				.setDescription('Song ' + song + ' has been removed by ' + message.author);
				message.channel.send(embededmessage);
				list(client, message, args);
			} else {
				message.channel.send('Invalid selection');
			}
		} else {
			message.channel.send('There are currently no songs playing on this server');
		}
	} else {
		message.channel.send('Invalid arguments');
	}
}

const shuffle = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		if (serverQueue.songs.length) {
			let currentIndex = serverQueue.songs.length;
			let tempValue, randomIndex;
			while (currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				tempValue = serverQueue.songs[currentIndex];
				serverQueue.songs[currentIndex] = serverQueue.songs[randomIndex];
				serverQueue.songs[randomIndex] = tempValue;
			}
			let embededmessage = new Discord.RichEmbed()
			.setColor('be92ff')
			.setDescription('Queue has been shuffled by ' + message.author);
			message.channel.send(embededmessage);
			list(client, message, args);
		} else {
			message.channel.send('There are currently no songs in queue');
		}
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

const repeat = (client, message, args) => {
	let serverQueue = clientQueue.get(message.guild.id);
	if (serverQueue) {
		serverQueue.repeat = !serverQueue.repeat;
		let embededmessage = new Discord.RichEmbed()
		.setColor('be92ff')
		.setDescription('Repeat has been ' + (serverQueue.repeat ? 'enabled':'disabled') + ' by ' + message.author);
		message.channel.send(embededmessage);
	} else {
		message.channel.send('There are currently no songs playing on this server');
	}
}

module.exports = {
	queue,
	stop,
	pause,
	resume,
	next,
	list,
	clear,
	remove,
	shuffle,
	repeat
}