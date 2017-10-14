const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const youtubeapi = require('simple-youtube-api');
const env = require('../env');

const clientQueue = new Map();
const youtube = new youtubeapi(env.youtube_token);

const queue = (client, message, args) => {
	let voiceChannel = message.member.voiceChannel;
	let query = args.join(' ');
	if (!voiceChannel) {
		message.channel.send('User not in voice channel');
	} else {
		voiceChannel.join().then((connection) => {
			if (query.match(/(www.youtube.com|youtube.com)*list=*/)) {
				playlistid = query.split('list=').pop();
				youtube.getPlaylistByID(playlistid).then((playlist) => {
					playlist.getVideos().then((results) => {
						results.forEach((video) => {
							let song = {
								title: video.title,
								url: 'https://www.youtube.com/watch?v=' + video.id,
								thumbnail: video.thumbnails.high.url,
								queued_by: message.author
							}
							handleQueue(connection, message, song);
						});
						let embededmessage = new Discord.RichEmbed()
						.setColor('be92ff')
						.setDescription(results.length + ' songs from ' + '[' + playlist.title + ']' + '(' + query + ')' + ' added to the queue by ' + message.author)
						message.channel.send(embededmessage);
					}).catch((error) => {
						console.log(error);
					});
				}).catch((error) => {
					console.log(error);
				});
			} else if (query.match(/(www.youtube.com|youtube.com)*watch\?v=*/)) {
				youtube.getVideo(query).then((results) => {
					let song = {
						title: results.title,
						url: 'https://www.youtube.com/watch?v=' + results.id,
						thumbnail: results.thumbnails.high.url,
						queued_by: message.author
					}
					handleQueue(connection, message, song);
					let embededmessage = new Discord.RichEmbed()
					.setColor('be92ff')
					.setDescription('[' + song.title + ']' + '(' + song.url + ')' + ' added to the queue by ' + song.queued_by)
					.setThumbnail(song.thumbnail);
					message.channel.send(embededmessage);
				}).catch((error) => {
					console.log(error);
				});
			} else {
				youtube.searchVideos(query).then((results) => {
					let videos = [];
					let i = 0;
					results.forEach((video) => {
						videos.push('[' + i + '] ' + video.title + '\n');
						i ++;
					});
					message.channel.send(('```css\n' + 'Please select the number corresponding to your search\n' + videos + '\n```').replace(/,/g, "")).then((tempMessage) => {
						message.channel.awaitMessages(response => !isNaN(response.content) && parseInt(response.content) < i, {
							max: 1,
							time: 15000,
							errors: ['max', 'time'],
						}).then((collected) => {
							let selection = results[parseInt(collected.first().content)];
							let song = {
								title: selection.title,
								url: 'https://www.youtube.com/watch?v=' + selection.id,
								thumbnail: selection.thumbnails.high.url,
								queued_by: message.author
							}
							handleQueue(connection, message, song);
							let embededmessage = new Discord.RichEmbed()
							.setColor('be92ff')
							.setDescription('[' + song.title + ']' + '(' + song.url + ')' + ' added to the queue by ' + song.queued_by)
							.setThumbnail(song.thumbnail);
							message.channel.send(embededmessage);
							tempMessage.delete();
							collected.first().delete();
						}).catch((error) => {
							console.log(error);
							message.channel.send('Error selecting number');
							tempMessage.delete();
						});
					});
				}).catch((error) => {
					console.log(error);
				});
			}
		}).catch((error) => {
			message.channel.send('Unable to join voice channel');
			console.log(error);
		});
	}
}

const handleQueue = (connection, message, song) => {
	let serverQueue = clientQueue.get(message.guild.id);
	let voiceChannel = message.member.voiceChannel;
	if (!serverQueue) {
		const queueConstruct = {
			voiceChannel: voiceChannel,
			connection: connection,
			songs: [],
			repeat: false
		}
		queueConstruct.songs.push(song);
		clientQueue.set(message.guild.id, queueConstruct);
		play(message, message.guild.id, queueConstruct.songs[0], null);
	} else {
		serverQueue.songs.push(song);
	}
}

const play = (message, guild, song, playingMessage) => {
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
	if (playingMessage) {
		playingMessage.delete();
	}
	let embededmessage = new Discord.RichEmbed()
	.setColor('be92ff')
	.setTitle(':headphones: Now Playing')
	.setDescription('[' + song.title + ']' + '(' + song.url + ')' + '\nQueued By ' + song.queued_by)
	.setThumbnail(song.thumbnail);
	message.channel.send(embededmessage).then((now_playing) => {
		dispatcher.setVolume(0.2);
	    dispatcher.on('error', (error) => {
	    	message.channel.send('Unable to play ' + song.title);
	        console.log(error);
	    });
	    dispatcher.on('end', (reason) => {
			if (serverQueue.repeat) {
		    	serverQueue.songs.push(song);
		    }
		    play(message, guild, serverQueue.songs[0], now_playing);
	    });
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