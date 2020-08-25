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
if(!tagged) return message.channel.send("Nope doesnt work.");
console.log(message.guild.id);
serverStats.findOneAndUpdate({
	guildId: "709865844670201967", 
	"guildMembers.userID": tagged.id
  },
  {
	  "guildMembers.$.eggCount": 0
  },
   {upsert: true}).exec();



}

module.exports.help = {
	name: "Delete Eggs",
	desc: "Deletes the tagged users eggs",
	usage: "!!eggdel"
}