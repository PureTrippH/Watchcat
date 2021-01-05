/*-----------------------------------------------
Still a WIP Feature
-----------------------------------------------*/
exports.run = async (client, message, args) => {
	const Discord = require('discord.js');
	const leaderBoard = new Discord.MessageEmbed();
	const serverStats = require('../utils/schemas/serverstat');
	let amount = 1;
	
	let topUser = await serverStats.aggregate([
			
				{ $match: {
					guildId: message.guild.id
				}},
			
				// Expand the scores array into a stream of documents
				{ $unwind: '$guildMembers' },
			
				// Sort in descending order
				{ $sort: {
					'guildMembers.messageCount': -1
				}}
		]).limit(10);
		topUser.forEach(user => {
			console.log(user.guildMembers.userID);
		})
		leaderBoard.setTitle("Watchcat Server Leaderboard");
		leaderBoard.setColor('#e3bcf7');
		leaderBoard.setFooter('No Life Board', "https://assets.stickpng.com/thumbs/580b57fbd9996e24bc43bb8a.png");
		leaderBoard.setThumbnail('https://assets.stickpng.com/thumbs/58adf251e612507e27bd3c32.png');
		leaderBoard.setAuthor(`Laela's WatchCat`, 'https://assets.stickpng.com/thumbs/580b57fbd9996e24bc43bb8a.png');
		topUser.forEach(async user => {
			
			let userName = message.guild.members.cache.get(user.guildMembers.userID);
			let level = getUserLevel(user.guildMembers.messageCount);
			leaderBoard.addFields({ name: `${amount}:  **(Level ${level.level})**`, value: `Level: **<@${user.guildMembers.userID}>**`, inline: true });
			amount++
		})

		message.channel.send(leaderBoard);
	}


const getUserLevel = (msgCountCurrent) => {
	let sumArr = [];
	let sumTot = 0;
	let levelCount = 0;
	let msgCount = 0;
	let respArray = [];

	for(let i = 0 ; msgCount < msgCountCurrent ; i++) {
	sumTot = 100*(i)^(1/2);
	sumArr.push(sumTot);
	msgCount = sumArr.reduce((a, b) => a + b, 0);
	levelCount = i	
	}
	respArray.push(levelCount, msgCount);

	return {
		level: levelCount,
		msgCount: msgCount,
		totalMsg: sumArr
	};
}

module.exports.help = {
	name: "Tier User",
	type: "moderation",
	desc: "Bans the User for the Tier Time. [ALSO, DO NOT JOKE WITH THIS COMMAND. This can lead to adding a tier NO MATTER WHAT!]",
	usage: "!!tierban (user) (tier)",
	aliases: ["leaderboard", "lb", "b", "top"]
}