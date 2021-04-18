const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
	//Get Manga and Chapter Lists
	const Disc = require('discord.js');
	const embed = new Disc.MessageEmbed();
	const manga = await fetch(`https://api.mangadex.org/v2/manga/${args[0]}/chapters`).then(res => res.json()).then(json => {return json});
	const chapList = getLang('gb', manga.data.chapters);
	if(chapList.length == 0) return message.channel.send("manga not available in English! If you know the native language, click the link above to translate it.");
	let pageNum = 1;
	this.postChapter(chapList, 1, pageNum, embed, message);
}


exports.postChapter = async(chapList, chapNum, pageNum, embed, message) => {
	console.log(chapNum);
	let data = await fetch(`https://api.mangadex.org/v2/chapter/${chapList[chapList.findIndex(chap => chap.chapter == chapNum)].id}`);
	let linkData = await data.json();
	embed.setTitle(linkData.data.mangaTitle);
	console.log(linkData.data.chapter);
	embed.setDescription(`Chapter: ${linkData.data.chapter} - ${linkData.data.title}`);
	if(linkData.data.pages.length <= pageNum-1) {
		return this.postChapter(chapList, chapNum+1, 1, embed, message);
	}
	let img = await fetch(`${linkData.data.server}${linkData.data.hash}/${linkData.data.pages[pageNum-1]}`);
	embed.setImage(img.url);
	let msg = await message.channel.send(embed);
	msg.react('➡️');
	msg.react('⏭️');
	msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '➡️':
				return this.postChapter(chapList, chapNum, pageNum+1, embed, message);
			break;
			case '⏭️':
				return this.postChapter(chapList, chapNum+1, 1, embed, message);
			break;
		}
	});
}

exports.nextPage = async(linkData, pageNumber, chapList, chapNum, embed, message) => {
	
	return img;
}


module.exports.help = {
	name: "Manga Reading Client",
	type: "fun",
	aliases: ['read'],
	desc: "Did you just use !!manga and found a REALLY good manga you are just anxious to read? Well, with !!read, all you do is type !!read (manga id [found in link]), and you can start reading the manga you found ON DISCORD. All Chapters are available. Go Wild and have a nice read! Ill be waiting here :).",
	usage: "!!read (manga ID)",
	gif: "https://cdn.discordapp.com/attachments/732237195980701820/820506242060517396/unknown.png"
}

const getLang = (lang, JSONinf) => {
	let list = new Array;
	JSONinf.forEach(chapter => {
		if(chapter.language == lang) {
			list.push(chapter);
		}
	})
	return(list);
}
