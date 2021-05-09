const fetch = require('node-fetch');
exports.run = async (client, message, args) => {
	const fs = require("fs");
	const Discord = require('discord.js');
	const read = require('./readmanga');
	
	const embed = new Discord.MessageEmbed();
	const listEmbed = new Discord.MessageEmbed();
	embed.setColor('#92cfd6');
	embed.setTitle('Watchcat - Random Manga');
	embed.setFooter('Brought to you by Mangadex');
	let mangaData = null;

	if(args[0]) {
		try {
		const manga = await fetch(`https://api.mangadex.org/manga?title="${args.slice(0).join(" ")}"`);
		mangaData = await manga.json();
		mangaData = await makeList(mangaData.results, listEmbed, message);
		console.log(mangaData);
		} catch(err) {console.log(err); return message.channel.send("Manga Not Found!");}
	} else {
		mangaData = await validLink(fetch);
	}
	if(mangaData.attributes.contentRating == "pornographic") return this.run(client, message, "");
	//embed.setImage(mangaData.data.mainCover);
	embed.setTitle(mangaData.attributes.title.en);
	embed.setDescription(convertFormCode(mangaData.attributes.description.en.substring(0, 2047)));
	embed.addFields({ name: `Demographic:`, value: `${(mangaData.attributes.publicationDemographic) ? mangaData.attributes.publicationDemographic : "Unknown"}`});
	embed.addFields({ name: `Rating:`, value: `${(mangaData.attributes.contentRating) ? mangaData.attributes.contentRating : "Unknown"}`});
	//embed.addFields({ name: `Link:`, value: `https://mangadex.org/title/${mangaData.data.id}/`});
	//embed.addFields({ name: `Star Rating:`, value: `${ratingInStars(mangaData.data.rating.bayesian).join("")} - ${mangaData.data.rating.bayesian}`});
	embed.setFooter("Like it? Click the '📚' To Read it IN WATCHCAT!");
	message.channel.send(embed).then(msg => {
		msg.react('📚');
		msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '📚':
				return read.run(client, message, [`${mangaData.id}`]);
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


/*
Coming Soon... Again

const ratingInStars = (num) => {

	let arr = new Array(10);

	let rating = Math.trunc(num);
  
	for(let it = 0 ; it < 10 ; it++) {
		  (rating > it) ? arr[it] = ('🌟') : arr[it] = ('⚫')
	}
	return arr
}
*/

const validLink = async (fetch) => {
	const manga = await fetch('https://api.mangadex.org/manga/random');
	let mangaData = await manga.json();
	return mangaData.data;
}

const makeList = async(searchResults, embed, message) => {
	let indexNum = 1;
	searchResults.forEach(result => {
		let desc = result.data.attributes.description.en.substring(0, 500);
		embed.addFields(
			{ name: `${indexNum}: ${result.data.attributes.title.en}`, value: `${convertFormCode(desc) ? convertFormCode(desc) : "No Description"}`, inline: true }
		  )
		indexNum++;
	})
	message.channel.send(embed);
	message.channel.send("Please send the Number of the Manga you want to Read");
	let index = await collectMsg(message);
	if(index-1 < indexNum-1) return searchResults[index-1].data;
}


const collectMsg = async(message) => {
	const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
		max: 1
	})
	return msg.first().content;
}

const convertFormCode = (message) => {
	message = message.replace("[/spoiler]", "||").replace("[spoiler]", "||");
	message =  message.replace("[b]", "**").replace("[/b]", "**");
	message =  message.replace("[u]", "__").replace("[/u]", "__");
	message =  message.replace("[hr]", "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ \n");
	message =  message.replace("[url=", "[").replace("[/url]", "](url)");
	message =  message.replace("&quot;", "\"")
	console.log(message);
	return message;
}