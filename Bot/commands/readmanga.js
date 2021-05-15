const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
	//Get Manga and Chapter Lists
	const Disc = require('discord.js');
	const embed = new Disc.MessageEmbed();
	try {
		const manga = await getMangaData(args[0], 1, message);
		this.postChapter(args[0] , 1, manga.data, manga.hash, 1, manga.title, message, embed);
	} catch(err) {return message.channel.send("Manga does not Exist in English YET!");}
}


exports.postChapter = async(mangaId, pageNum, panelArray, hash, chapNum, mangaTitle, message, embed) => {
	console.log(panelArray);
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
				try {
				message.channel.send("Please Send a Chapter Number");
				const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
					max: 1
				})
				return this.postChapter(mangaId, 1, data.data, data.hash, parseInt(msg.first().content), data.title, message, embed);
				}catch(err) {
					return message.channel.send("Chapter Does Not Exist!");
				}
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
				console.log(data);
				return this.postChapter(mangaId, 1, data.data, data.hash, chapNum+1, data.title , message, embed);
				}  catch(err) {
					return message.channel.send("You have Read Every Chapter of this manga! Do !!manga to find a new one to read!");
				}
			break;
		}
	});
}


const getMangaData = async(mangaId, chapNum, message) => {
		return await fetch(`https://api.mangadex.org/chapter?manga=${mangaId}&chapter=${chapNum}&translatedLanguage=en`).then(res => res.json()).then(json => {return json.results[0].data.attributes});
}


module.exports.help = {
	name: "Manga Reading Client",
	type: "fun",
	aliases: ['read'],
	desc: "Did you just use !!manga and found a REALLY good manga you are just anxious to read? Well, with !!read, all you do is type !!read (manga id [found in link]), and you can start reading the manga you found ON DISCORD. All Chapters are available. Go Wild and have a nice read! Ill be waiting here :).",
	usage: "!!read (manga ID)",
	gif: "https://cdn.discordapp.com/attachments/732237195980701820/820506242060517396/unknown.png"
}