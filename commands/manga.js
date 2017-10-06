const Discord = require('discord.js');
const env = require('../env.json');
const request = require('request');

const run = (client, message, args) => {
	message.channel.startTyping(2);
	args = args.join(' ');
	let tokenpost = {
		url: 'https://anilist.co/api/auth/access_token',
		formData: {grant_type:'client_credentials', client_id: env.anilist_id, client_secret: env.anilist_secret}
	};
	request.post(tokenpost, (error, response, result) => {
		let token = JSON.parse(result);
		let getmangas = {
			url: 'https://anilist.co/api/manga/search/' + args,
			qs: {access_token: token}
		}
		request.get(getmangas, (error, response, result) => {
			let mangas = JSON.parse(result);
			if ('error' in mangas) {
				console.log('Error finding manga');
			} else {
				let mangaarray = [];
				let manganamearray = [];
				let i = 0;
				mangas.forEach((manga) => {
					mangaarray.push(manga);
					manganamearray.push('[' + i + '] ' + manga.title_english + '\n');
					i++;
				});
				message.channel.send(('```css\n' + 'Please select a manga number\n' + manganamearray + '\n```').replace(/,/g, "")).then((tempMessage) => {
					message.channel.stopTyping();
					message.channel.awaitMessages(response => !isNaN(response.content) && parseInt(response.content) < i, {
						max: 1,
						time: 15000,
						errors: ['max', 'time'],
					}).then((collected) => {
						let mangaobject = mangaarray[parseInt(collected.first().content)];
						console.log(mangaobject);
						let embededmessage = new Discord.RichEmbed()
						.setAuthor(mangaobject.title_english, mangaobject.image_url_lge)
						.setDescription(mangaobject.description.replace(/<\/?[^>]+(>|$)/g, ""))
						.addField('Score', mangaobject.average_score, true)
						.addField('Genres', mangaobject.genres, true)
						.addField('Chapters', mangaobject.total_chapters, true)
						.addField('Status', mangaobject.publishing_status, true)
						.setImage(mangaobject.image_url_lge)
						.setColor('#be92ff');
						collected.first().delete();
						tempMessage.delete();
						message.channel.send(embededmessage);
						message.channel.stopTyping();
					}).catch(() => {
						console.log('Error selecting manga number');
						message.channel.stopTyping();
						tempMessage.delete();
					});
				});
			}
		});
	});
}

module.exports = {
	run
}