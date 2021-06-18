const fetch = require('node-fetch');
const mangaSchem = require('../utils/schemas/mangasave');
const mongoose = require('mongoose');

exports.run = async (client, message, args) => {
	let newManga = null;
	//Get Manga and Chapter Lists
	const Disc = require('discord.js');
	const embed = new Disc.MessageEmbed();
	try {
		await mangaSchem.findOne({
			mangaID: args[0],
			userID: message.author.id,
		}).then(async res => {
			if(res) {
				newManga = await getMangaData(args[0], res.chapterNum, message);
				return this.postChapter(args[0], res.pageNum, newManga.data, newManga.hash, res.chapterNum, newManga.title, message, embed);
			} else {
				newManga = await getMangaData(args[0], 1, message);
				return this.postChapter(args[0], 1, newManga.data, newManga.hash, 1, newManga.title, message, embed);
			}
		});
	} catch(err) {console.log(err); return message.channel.send("Manga does not Exist in English YET!");}
}


exports.postChapter = async(mangaId, pageNum, panelArray, hash, chapNum, mangaTitle, message, embed) => {
	let ad = false;
	if(Math.floor(Math.random() * 400) == 1) {
		embed.setTitle("Adertisement!");
		embed.setDescription(`This slot allows Watchcat to feature some of the cool places on discord. 
		Here is one willing to give watchcat a shot. Thank you for the support. 
		Also... Don't worry about ads. There is a 1/300 chance. We dont want to ruin the reading experience.
		`);
		embed.setImage(`https://i.kym-cdn.com/photos/images/newsfeed/000/633/851/bfa.jpg`);
		ad = true;
	} else {
	embed.setDescription("");
	embed.setTitle(mangaTitle);
	embed.setImage(`https://s2.mangadex.org/data/${hash}/${panelArray[pageNum-1]}`)
	}
	let msg = await message.channel.send(embed);
	msg.react('➡️');
	msg.react('⏭️');
	msg.react('🔍');
	msg.react('💾');
	msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collection => {
		let reaction = collection.first().emoji.name;
		if(reaction && ad) {
			return this.postChapter(mangaId, pageNum, panelArray, hash, chapNum, mangaTitle, message, embed);
		}
		switch(reaction) {
			case '🔍':
				message.channel.send("Please Send a Chapter Number");
				const msg = await collectMsg(message);
				let data = await getMangaData(mangaId, parseInt(msg), message);
				console.log(msg);
				return this.postChapter(mangaId, 1, data.data, data.hash, parseInt(msg), data.title, message, embed);
			case '➡️':
				if(panelArray.length <= pageNum+1) {
					try {
					let data = await getMangaData(mangaId, chapNum+1, message);
					return this.postChapter(mangaId, 1, data.data, data.hash, chapNum+1, data.title, message, embed);
					}  catch(err) {
						return message.channel.send("You have Read Every Chapter of this manga! Do !!manga to find a new one to read!");
					}
				}
				return this.postChapter(mangaId, pageNum+1, panelArray, hash, chapNum, mangaTitle, message, embed);
			break;
			case '💾':
				await mangaSchem.findOneAndUpdate({
					mangaID: mangaId,
					userID: message.author.id,
				}, {
					chapterNum: chapNum,
					pageNum: pageNum
				}).then(async res => {
					if(!res) {
						await mangaSchem.create([{
							_id: mongoose.Types.ObjectId(),
							mangaID: mangaId,
							userID: message.author.id,
							chapterNum: chapNum,
							pageNum: pageNum
						}])
					}
				}).then(() => {
					message.channel.send("Your place in the manga has been saved! Remember: You can access any save by using !!manga --l or just searching the manga again and it will pick you back up where you left off!");
					return this.postChapter(mangaId, pageNum, panelArray, hash, chapNum, mangaTitle, message, embed);
				})
			break;
			case '⏭️':
				try {
				await getMangaData(mangaId, chapNum+1);
				let data = await getMangaData(mangaId, chapNum+1, message);
				return this.postChapter(mangaId, 1, data.data, data.hash, chapNum+1, data.title , message, embed);
				}  catch(err) {
					return message.channel.send("You have Read Every Chapter of this manga! Do !!manga to find a new one to read!");
				}
			break;
		}
	});
}


const getMangaData = async(mangaId, chapNum, message) => {
	return await fetch(`https://api.mangadex.org/chapter?manga=${mangaId}&chapter=${chapNum}&translatedLanguage[]=en`).then(res => res.json()).then(json => {
		try {
		return json.results[0].data.attributes
		} catch(err) {return null}
	});
}
const collectMsg = async(message) => {
	const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
		max: 1
	})
	return msg.first().content;
}

module.exports.help = {
	name: "Manga Reading Client",
	type: "fun",
	aliases: ['read', 'rm'],
	desc: `Did you just use !!manga and found a REALLY good manga you are just anxious to read? Well, with !!read, all you do is type !!read (manga id [found in link]), and you can start reading the manga you found ON DISCORD. 
	All Chapters are available./n
	Controls:/n
	- To Search for a Chapter, click the Magnifiying Glass. /n
	/n
	- To Skip a Chapter, click the Double Arrows. /n
	/n
	 - To go to the next page, click the singular arrow. /n
	 /n
	 Now, Go Wild and have a nice read! Ill be waiting here :).`,
	usage: "!!read (manga ID)",
	gif: "https://cdn.discordapp.com/attachments/401507818718625794/854898706829279252/Manga.gif"
}