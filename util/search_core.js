const Discord = require('discord.js');
const env = require('../env');
const request = require('request');

const search =  (media, message, args) => {
	message.channel.startTyping();
	args = args.join(' ');
	let tokenpost = {
		url: 'https://anilist.co/api/auth/access_token',
		formData: {grant_type:'client_credentials', client_id: env.anilist_id, client_secret: env.anilist_secret}
	};
	request.post(tokenpost, (error, response, result) => {
		let token = JSON.parse(result);
		let get_media = {
			url: 'https://anilist.co/api/' + media + '/search/' + args,
			qs: {access_token: token}
		}
		request.get(get_media, (error, response, result) => {
			let json_results = JSON.parse(result);
			if ('error' in json_results) {
				console.log('Error finding ' + args);
				message.channel.send('Error finding ' + args);
				message.channel.stopTyping();
			} else {
				let media_array = [];
				let media_name_array = [];
				let i = 0;
				json_results.forEach((show) => {
					media_array.push(show);
					media_name_array.push('[' + i + '] ' + show.title_english + '\n');
					i++;
				});
				message.channel.send(('```css\n' + 'Please select the number corresponding to your search\n' + media_name_array + '\n```').replace(/,/g, "")).then((tempMessage) => {
					message.channel.awaitMessages(response => !isNaN(response.content) && parseInt(response.content) < i, {
						max: 1,
						time: 15000,
						errors: ['max', 'time'],
					}).then((collected) => {
						let selection = media_array[parseInt(collected.first().content)];
						let embededmessage = new Discord.RichEmbed()
						.setAuthor(selection.title_english, selection.image_url_lge)
						.setDescription(selection.description.replace(/<\/?[^>]+(>|$)/g, ""))
						.addField('Score', selection.average_score, true)
						.addField('Genres', selection.genres, true)
						.setImage(selection.image_url_lge)
						.setColor('#be92ff');
						if (media === 'anime') {
							embededmessage
							.addField('Episodes', selection.total_episodes, true)
							.addField('Status', selection.airing_status, true);
						} else {
							embededmessage
							.addField('Chapters', selection.total_chapters, true)
							.addField('Status', selection.publishing_status, true)
						}
						collected.first().delete();
						tempMessage.delete();
						message.channel.send(embededmessage);
						message.channel.stopTyping();
					}).catch(() => {
						console.log('Error selecting search number');
						message.channel.send('Error selecting search number');
						message.channel.stopTyping();
						tempMessage.delete();
					});
				});
			}
		});
	});
}

module.exports = {
	search
}