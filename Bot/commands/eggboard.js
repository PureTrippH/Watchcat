exports.run = async(client, message, args) => {
	const Discord = require('discord.js');
	const tagged = message.mentions.users.first();
	const reason = args.slice(1).join(" ") || "Unknown Reason";
	const serverStats = require("../utils/schemas/serverstat.js");
	const fs = require("fs");
	const exampleEmbed = new Discord.MessageEmbed();

	const dbResStats = await serverStats.findOne({
		guildId: message.guild.id
	  });
	
console.log(message.guild.id);

	  let leaders = sortArray(dbResStats);
	  exampleEmbed.setColor('#e3bcf7');
	  exampleEmbed.setFooter('Egg Hunt - 1 Week', "https://vignette.wikia.nocookie.net/minecraft/images/a/a4/EggNew.png/revision/latest?cb=20190829232139");
	  exampleEmbed.setTimestamp();
	  exampleEmbed.setAuthor(`Laela's WatchCat`, 'https://vignette.wikia.nocookie.net/minecraft/images/a/a4/EggNew.png/revision/latest?cb=20190829232139')
	  exampleEmbed.setThumbnail('https://vignette.wikia.nocookie.net/minecraft/images/a/a4/EggNew.png/revision/latest?cb=20190829232139');
	  for(i = 0 ; i<=10 ; i++) {
		  if(i >= leaders.length || i == 9) return message.channel.send(exampleEmbed);
		  console.log("IM ON " + i);
		exampleEmbed.addFields({ name: `${i + 1}: ${message.guild.member((leaders[i]).userID).displayName}`, value: `Eggs: **${leaders[i].eggCount}**`, inline: true });
		
	  }

	  
	  message.channel.send(exampleEmbed);

}


const sortArray = (stats) => {
	let leaderboardVals = [];
	stats.guildMembers.forEach(author => {
		let trueEgg = (typeof(author.eggCount) === 'undefined') ? 0 : author.eggCount
		if(trueEgg != 0) {
			leaderboardVals.push({
				userID: author.userID,
				eggCount: trueEgg
			})
		}
	}); 

	return leaderboardVals.sort((a, b) => {
		if(a.eggCount < b.eggCount){
			return 1;
		}	else if(a.eggCount > b.eggCount){
			return -1;
		}	else{
			return 0;
	}
	})
};

module.exports.help = {
	name: "Egg Leaderboard",
	type: "event",
	aliases: [],
	desc: "Egg Event (WIP): Shows the Leaderboard for your Server's Egg Hunt: ",
	usage: "!!eggboard",
	gif: "https://cdn.discordapp.com/attachments/812829546893541407/812831433562652703/Screenshot_344.png",
}