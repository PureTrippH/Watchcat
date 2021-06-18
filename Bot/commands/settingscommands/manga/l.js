const Discord = require('discord.js');
const fetch = require('node-fetch');

const mangaSchema = require('../../../utils/schemas/mangasave');
const manga  = require('../../manga.js');
const read  = require('../../readmanga');
const essFuncs = require('../../../utils/globalfuncs');
exports.run = async (client, message, args) => {
    console.log(message.author.id);
    let res = await mangaSchema.find({
        userID: message.author.id,
    });

    return this.turnPage(client, message, args, res, 0);
};

exports.turnPage = async (client, message, args, res, index) => {
    const embed = new Discord.MessageEmbed();
    const fetch = require('node-fetch');
    let mangaData = await fetch(`https://api.mangadex.org/manga/${res[index].mangaID}`).then(results => results.json());
    let tagList = [];
    const { chapterNum, pageNum } = res[index];
	mangaData.data.attributes.tags.forEach(tag => {
		tagList.push(tag.attributes.name.en);
	})
    embed.setTitle(mangaData.data.attributes.title.en);
    embed.addFields({ name: `Where You Left Off:`, value: `Chapter ${chapterNum}: Page ${pageNum}`});
    embed.addFields({ name: `Percent Finished:`, value: `*${Math.trunc((chapterNum / mangaData.data.attributes.lastChapter) * 100)}%*`});
    manga.getGenreIcon(tagList, embed);
    let cover = await (await fetch(`https://api.mangadex.org/cover?manga[]=${mangaData.data.id}`)).json();
	if(cover.results[0]) {
		embed.setImage(`https://uploads.mangadex.org/covers/${mangaData.data.id}/${cover.results[0].data.attributes.fileName}`);
	}
    message.channel.send(embed).then(msg => {
		msg.react('📚');
        msg.react('➡️');
		msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '📚':
				return read.run(client, message, [`${mangaData.data.id}`]);
			break;
            case '➡️':
				if(res.length <= index+1) {
				    return this.turnPage(client, message, args, res, 0)
                }
                return this.turnPage(client, message, args, res, index+1)
			break;
		};
		})
	});
}

