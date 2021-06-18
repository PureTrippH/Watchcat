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
		if(args[0].includes("--")) {
			let subArg = args[0].split("--")[1];
			if(fs.existsSync(`./commands/settingscommands/manga/${subArg}.js`)) {
				const selectedSetting = require(`./settingscommands/manga/${subArg}`);
				return selectedSetting.run(client, message, args);
			}
		}
		try {
		const manga = await fetch(`https://api.mangadex.org/manga?title="${args.slice(0).join(" ")}"&limit=99`);
		mangaData = await manga.json();
		mangaData = await this.mangaList(mangaData.results, listEmbed, message, 0, 10);
		if(mangaData == null) return;
		} catch(err) {console.log(err); return message.channel.send("Manga Not Found!");}
	} else {
		mangaData = await validLink(fetch);
	}
	if(mangaData.attributes.contentRating == "pornographic") return this.run(client, message, "");
	//embed.setImage(mangaData.data.mainCover);
	let tagList = [];
	mangaData.attributes.tags.forEach(tag => {
		tagList.push(tag.attributes.name.en);
	})
	embed.setTitle(convertFormCode(mangaData.attributes.title.en));
	let cover = await (await fetch(`https://api.mangadex.org/cover?manga[]=${mangaData.id}`)).json();
	if(cover.results[0]) {
		embed.setImage(`https://uploads.mangadex.org/covers/${mangaData.id}/${cover.results[0].data.attributes.fileName}`);
	}
	this.getGenreIcon(tagList, embed);
	embed.setDescription(convertFormCode(mangaData.attributes.description.en.substring(0, 2000)));
	embed.addFields({ name: `Demographic:`, value: `${(mangaData.attributes.publicationDemographic) ? mangaData.attributes.publicationDemographic : "Unknown"}`});
	embed.addFields({ name: `Rating:`, value: `${(mangaData.attributes.contentRating) ? mangaData.attributes.contentRating : "Unknown"}`});
	embed.addFields({ name: `Genres:`, value: `${tagList.toString()}`});
	//embed.addFields({ name: `Link:`, value: `https://mangadex.org/title/${mangaData.data.id}/`});
	//embed.addFields({ name: `Star Rating:`, value: `${ratingInStars(mangaData.data.rating.bayesian).join("")} - ${mangaData.data.rating.bayesian}`});
	embed.setFooter("Like it? Click the '📚' To Read it IN WATCHCAT!");
	message.channel.send(embed).then(msg => {
		msg.react('📚');
		msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '📚':
				if(mangaData.attributes.contentRating == "pornographic") return this.run(client, message, "");
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
	desc: `Are You Just Bored and Need to Read a Random Manga? Well, with this command, you can fetch a random manga for you to read! 
	This can help you find something new to read, and maybe you can find a new love. /n 
	/n
	/n
	If you want to read a series you know, simply type something like:/n
	!!manga Quintessential Quintuplets /n
	or/n
	!!manga Chainsaw Man/n
	/n
	and it will find that title for you to read!/n
	/n
	Also, if you want to access your saves, just type !!manga --l
	/n 
	`,
	usage: "!!manga",
	gif: "https://cdn.discordapp.com/attachments/548659297517830155/855103264722255923/ezgif.com-gif-maker.gif"
}


exports.getGenreIcon = (genreArray, embed) => {
	console.log(genreArray);
	for(let x = 0 ; x < genreArray.length ; x++) {
		switch(genreArray[x]) {
			case 'Award Winning':
				x = genreArray.length;
				return embed.setThumbnail('https://emojigraph.org/media/messenger/star_2b50.png');
			break;
			case 'Mystery':
				x = genreArray.length;
				return embed.setThumbnail('https://cdn.emojidex.com/emoji/seal/thonk.png?1544287589');
			break;
			case 'Comedy':
				x = genreArray.length;
				return embed.setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/76/smiling-face-with-open-mouth-and-tightly-closed-eyes_1f606.png');
			break;

			case ('Romance'):
				x = genreArray.length;
				for(let subX = 0 ; subX < genreArray.length ; subX++) {
					switch(genreArray[subX]) {
						case `Girl's Love`:
							x = genreArray.length;
							return embed.setThumbnail('https://i.imgur.com/sAs61EJ.png');
						break;
						case `Boy's Love`:
							x = genreArray.length;
							return embed.setThumbnail('https://i.imgur.com/TgVqI02.png');
						break;
					}
					subX++
				}
				return embed.setThumbnail('https://images.vexels.com/media/users/3/144097/isolated/preview/3dedcd235214cdde6b4e171fdbf66c9d-heart-icon-by-vexels.png');
			break;

			case 'Drama':
				x = genreArray.length;
				return embed.setThumbnail('http://cdn.onlinewebfonts.com/svg/download_318795.png');
			break;

			case 'Action':
				x = genreArray.length;
				return embed.setThumbnail('https://icons-for-free.com/iconfiles/png/512/fight-1320568180090332670.png');
			break;

			case 'Fantasy':
				x = genreArray.length;
				return embed.setThumbnail('https://cdn-0.emojis.wiki/emoji-pics/messenger/crystal-ball-messenger.png');
			break;

			case 'Slice of Life':
				return embed.setThumbnail('https://cdn2.iconfinder.com/data/icons/food-drink-60/50/1F952-cucumber-512.png');
			break;

			case 'Reincarnation':
				return embed.setThumbnail('https://i.imgur.com/M6zthbK.png');
			break;
			case `Girl's Love`:
				x = genreArray.length;
				return embed.setThumbnail('https://i.imgur.com/sAs61EJ.png');
			break;
			case `Boy's Love`:
				x = genreArray.length;
				return embed.setThumbnail('https://i.imgur.com/TgVqI02.png');
			break;
			case `Horror`:
				x = genreArray.length;
				return embed.setThumbnail('https://emojis.wiki/emoji-pics/apple/goblin-apple.png');
			break;

			case 'Doujinshi':
				x = genreArray.length;
				return embed.setThumbnail('https://images.emojiterra.com/google/android-11/512px/1f51e.png');
			break;

			case 'Supernatural':
				x = genreArray.length;
				return embed.setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/facebook/158/four-leaf-clover_1f340.png');
			break;
		}
	}
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
	await fetch(`https://api.mangadex.org/chapter?manga=${mangaData.id}&chapter=1&translatedLanguage[]=en`).then(res => res.json()).then(async json => {
		try {
		console.log(json);
		} catch(err) {return await validLink(fetch)}
	});

	return mangaData.data;
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
	message =  message.replace("[hr]", "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ /n");
	message =  message.replace("[url=", "[").replace("[/url]", "](url)");
	message =  message.replace("&quot;", "\"");
	message = message.replace ("&rsquo;", "'");
	message = message.replace ("[i]", "*").replace("[/i]", "*");
	return message;
}

exports.mangaList = async(searchResults, embed, message, num1, num2) => {
	let indexNum = 1;
	if(num1 > searchResults.length) return this.mangaList(searchResults, embed, message, 0, 10);
	searchResults.slice(num1, num2).forEach(result => {
		let desc = result.data.attributes.description.en.substring(0, 450);
		embed.addFields(
			{ name: `${indexNum}: ${result.data.attributes.title.en}`, value: `${convertFormCode(desc) ? convertFormCode(desc) : "No Description"}`, inline: true }
		  )
		indexNum++;
	})
	message.channel.send(embed);
	message.channel.send("Please send the Number of the Manga you want to Read. Type Next or Back to see other Selections. Type Exit to leave");
	embed.fields = [];
	let index = await collectMsg(message);
	if(index.toLowerCase() == "exit") {
		return null;
	}
	if(index.toLowerCase() == "next") {
		return this.mangaList(searchResults, embed, message, num1+10, num2+10);
	} else if(index-1 <= indexNum-1) {console.log(parseInt(num1)+(index-1)); return searchResults[parseInt(num1)+(index-1)].data;}
	else {message.channel.send("Manga Not Found!"); return this.mangaList(searchResults, embed, message, num1, num2)}; 
}
