exports.run = async(client, message, args) => {
	const Discord = require('discord.js');
	const tagged = message.mentions.users.first();
	const reason = args.slice(1).join(" ") || "Unknown Reason";
	const serverStats = require("../../utils/schemas/serverstat");
	const fs = require("fs");
	const exampleEmbed = new Discord.MessageEmbed();

	const dbResStats = await serverStats.findOne({
		guildId: message.guild.id
	  });
	
	console.log(message.guild.id);

	  let leaders = sortArray(dbResStats);
	  exampleEmbed.setColor('#e3bcf7');
	  exampleEmbed.setFooter('Trivia Leaderboard', "https://lh3.googleusercontent.com/proxy/qATfAOL5i1fYQGxrOQIF8ZIP-CPwZvcISjfpHdYpvDFFfgNkW1MgZN7_5zI84S9rOblRAPCjWVPHHEhV0BrpT0r9WUhsQrSSik8aRvL12gwIEHFQa30OudA2o0g5nylM");
	  exampleEmbed.setTimestamp();
	  exampleEmbed.setAuthor(`Laela's WatchCat`, 'https://lh3.googleusercontent.com/proxy/qATfAOL5i1fYQGxrOQIF8ZIP-CPwZvcISjfpHdYpvDFFfgNkW1MgZN7_5zI84S9rOblRAPCjWVPHHEhV0BrpT0r9WUhsQrSSik8aRvL12gwIEHFQa30OudA2o0g5nylM')
	  exampleEmbed.setThumbnail('https://static01.nyt.com/images/2019/04/23/arts/23jeopardy2/23jeopardy2-superJumbo.jpg');
	  for(i = 0 ; i<=10 ; i++) {
		  if(i >= leaders.length || i == 9) return message.channel.send(exampleEmbed);
		exampleEmbed.addFields({ name: `${i + 1}: ${message.guild.member((leaders[i]).userID).displayName}`, value: `Correct Answers: **${leaders[i].triviaCorrect}**`, inline: true });
		
	  }

	  
	  message.channel.send(exampleEmbed);

}


const sortArray = (stats) => {
	let leaderboardVals = [];
	stats.guildMembers.forEach(author => {
		let trueEgg = (typeof(author.triviaCorrect) === 'undefined') ? 0 : author.triviaCorrect
		if(trueEgg != 0) {
			leaderboardVals.push({
				userID: author.userID,
				triviaCorrect: trueEgg
			})
		}
	}); 

	return leaderboardVals.sort((a, b) => {
		if(a.triviaCorrect < b.triviaCorrect){
			return 1;
		}	else if(a.triviaCorrect > b.triviaCorrect){
			return -1;
		}	else{
			return 0;
	}
	})
};

module.exports.help = {
	name: "Egg Leaderboard",
	desc: "Shows Laelaserv Egg Leaderboard",
	usage: "!!eggboard"
}