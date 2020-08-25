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
	
	const userIndex = dbResStats.guildMembers.findIndex(user => user.userID === message.author.id);

console.log(message.guild.id);
	  exampleEmbed.setColor('#e3bcf7');
	  exampleEmbed.setFooter('test', "https://vignette.wikia.nocookie.net/minecraft/images/a/a4/EggNew.png/revision/latest?cb=20190829232139");
	  exampleEmbed.setTimestamp();
	  exampleEmbed.setAuthor(`Laela's WatchCat`, 'https://vignette.wikia.nocookie.net/minecraft/images/a/a4/EggNew.png/revision/latest?cb=20190829232139')
	  exampleEmbed.setThumbnail('https://vignette.wikia.nocookie.net/minecraft/images/a/a4/EggNew.png/revision/latest?cb=20190829232139');
	  exampleEmbed.addFields({ name: `${message.guild.member(dbResStats.guildMembers[userIndex].userID).displayName}`, value: `Eggs: **${dbResStats.guildMembers[userIndex].eggCount}**`, inline: true });
	  message.channel.send(exampleEmbed);

}

module.exports.help = {
	name: "Eggs",
	desc: "Shows Your Egg Count",
	usage: "!!eggs"
}