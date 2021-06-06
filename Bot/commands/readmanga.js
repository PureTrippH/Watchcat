const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
	let newManga = await getMangaData(args[0], 1, message);
	//Get Manga and Chapter Lists
	const Disc = require('discord.js');
	const embed = new Disc.MessageEmbed();
	try {
		console.log(args[0]);
		console.log(newManga);
		this.postChapter(args[0], 1, newManga.data, newManga.hash, 1, newManga.title, message, embed);
	} catch(err) {console.log(err); return message.channel.send("Manga does not Exist in English YET!");}
}


exports.postChapter = async(mangaId, pageNum, panelArray, hash, chapNum, mangaTitle, message, embed) => {
	embed.setTitle(mangaTitle);
	embed.setImage(`https://s2.mangadex.org/data/${hash}/${panelArray[pageNum-1]}`)
	let msg = await message.channel.send(embed);
	panelArray[pageNum-1]
	msg.react('➡️');
	msg.react('⏭️');
	msg.react('🔍');
	msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '🔍':
				message.channel.send("Please Send a Chapter Number");
				const msg = await collectMsg(message);
				let data = await getMangaData(mangaId, chapNum+1, message);
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
	aliases: ['read'],
	desc: `Did you just use !!manga and found a REALLY good manga you are just anxious to read? Well, with !!read, all you do is type !!read (manga id [found in link]), and you can start reading the manga you found ON DISCORD. 
	All Chapters are available.
	Controls:
	- To Search for a Chapter, click the Magnifiying Glass. 
	 
	- To Skip a Chapter, click the Double Arrows. 
	 
	 - To go to the next page, click the singular arrow. 
	 
	 Now, Go Wild and have a nice read! Ill be waiting here :).`,
	usage: "!!read (manga ID)",
	gif: "https://cdn.discordapp.com/attachments/850866166917365780/850934183961690152/Screenshot_641.png"
}