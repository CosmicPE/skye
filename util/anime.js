const Discord = require('discord.js');
const env = require('../env.json');
const request = require('request');

const findShow = (message, args) => {

	let tokenpost = {
		url: 'https://anilist.co/api/auth/access_token',
		formData: {grant_type:'client_credentials', client_id: env.anilist_id, client_secret: env.anilist_secret}
	};

	request.post(tokenpost, (error, response, result) => {
		let token = JSON.parse(result);
		let getshows = {
			url: 'https://anilist.co/api/anime/search/' + args,
			qs: {access_token: token}
		}
		request.get(getshows, (error, response, result) => {

			let shows = JSON.parse(result);

			if ('error' in shows) {
				console.log('Error finding show');
			} else {
				let showarray = [];
				let shownamearray = [];
				let i = 0;
				shows.forEach((show) => {
					showarray.push(show);
					shownamearray.push('[' + i + '] ' + show.title_english + '\n');
					i++;
				});
				message.channel.send(('```css\n' + 'Please select a show number\n' + shownamearray + '\n```').replace(/,/g, "")).then((tempMessage) => {
					message.channel.awaitMessages(response => !isNaN(response.content) && parseInt(response.content) < i, {
						max: 1,
						time: 15000,
						errors: ['max', 'time'],
					}).then((collected) => {
						console.log(collected.first());
						let showobject = showarray[parseInt(collected.first().content)];
						let embededmessage = new Discord.RichEmbed(showobject)
						.setAuthor(showobject.title_english, showobject.image_url_lge)
						.setDescription(showobject.description.replace(/<\/?[^>]+(>|$)/g, ""))
						.addField('Score', showobject.average_score, true)
						.addField('Genres', showobject.genres, true)
						.addField('Episodes', showobject.total_episodes, true)
						.addField('Status', showobject.airing_status, true)
						.setImage(showobject.image_url_lge)
						.setColor('#be92ff');
						collected.first().delete();
						tempMessage.delete();
						message.channel.send(embededmessage);
					}).catch(() => {
						console.log('Error selecting show number');
						tempMessage.delete();
					});
				});
			}
		});
	});
}

module.exports = {
	findShow
}