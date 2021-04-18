const fetch = require('node-fetch');
exports.run = async (client, message, args) => {
	const fs = require("fs");
	const Discord = require('discord.js');
	const read = require('./readmanga');
	
	const embed = new Discord.MessageEmbed();

	embed.setColor('#92cfd6');
	embed.setTitle('Watchcat - Random Manga');
	embed.setFooter('Brought to you by Mangadex');

	const mangaData = await validLink(fetch);
	message.delete({ timeout: 2000 });
	
	embed.setImage(mangaData.data.mainCover);
	embed.setTitle(mangaData.data.title);
	embed.setDescription(mangaData.data.description.substring(0, 2048).replace("&minus;", "-").replace("&minus;", "-").replace("&rdquo;", ""-"").replace("&ldquo;", '"'));
	embed.addFields({ name: `Hentai?:`, value: `${mangaData.data.isHentai ? "Yes" : "No"}`});
	embed.addFields({ name: `Link:`, value: `https://mangadex.org/title/${mangaData.data.id}/`});
	embed.addFields({ name: `Star Rating:`, value: `${ratingInStars(mangaData.data.rating.bayesian).join("")} - ${mangaData.data.rating.bayesian}`});
	embed.setFooter("Like it? Click the '📚' To Read it IN WATCHCAT!");
	message.channel.send(embed).then(msg => {
		msg.react('📚');
		msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '📚':
				return read.run(client, message, [`${mangaData.data.id}`]);
			break;
		};
		})
	});
}
module.exports.help = {
	name: "Manga",
	type: "fun",
	aliases: ['man', 'randommanga'],
	desc: "Are You Just Bored and Need to Read a Random Manga? Well, with this command, you can fetch a random manga right off mangadex. This can help you find something new to read, and maybe you can find a new love.",
	usage: "!!manga",
	gif: "https://cdn.discordapp.com/attachments/732237195980701820/820506242060517396/unknown.png"
}

const getRandomUrl = (linkArr) => {
	const chars = '0123456789';
	let rand = Math.floor(Math.random() * 5) + 1;
	for(let i = 0 ; i < rand ; i++) {
		let randomChar = (chars.charAt(Math.floor(Math.random() * chars.length)));
		linkArr.push(randomChar);
	}
	if(rand <3 && (Math.floor(Math.random() * 5) + 1) != 2) {
		return getRandomUrl([]);
	}
	return (linkArr.reduce((a, b) => a + b));
}

const ratingInStars = (num) => {

	let arr = new Array(10);

	let rating = Math.trunc(num);
  
	for(let it = 0 ; it < 10 ; it++) {
		  (rating > it) ? arr[it] = ('🌟') : arr[it] = ('⚫')
	}
	return arr
}


const validLink = async (fetch) => {
	let linkArr = [];

	const Canvas = require('canvas');

	let imgurString = 'https://api.mangadex.org/v2/manga/';

	let newLink = imgurString + getRandomUrl(linkArr) + ''
	const manga = await fetch(newLink);
	let parsedRes = await manga.json();
		if(parsedRes.code == 404) {
			newLink = '';
			console.log("404");
			return validLink(fetch);
		} else {
			return parsedRes;
		}
}