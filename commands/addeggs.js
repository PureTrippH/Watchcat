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
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
	if(!tagged) return message.channel.send("Nope doesnt work.");
	if(isNaN(args[1]) || !(parseInt(args[1]))) return message.channel.send("No integer specified.");
console.log(message.guild.id);
serverStats.findOneAndUpdate({
	guildId: "709865844670201967", 
	"guildMembers.userID": tagged.id
  },
  {
	  $inc: {
	  	"guildMembers.$.eggCount": parseInt(args[1])
	  },
  },
   {upsert: true}).exec();



}
}

module.exports.help = {
	name: "Add Eggs",
	type: "event",
	desc: "Adds to the tagged users eggs",
	usage: "!!addeggs (user) (amount)"
}