exports.run = async(client, message, args) => {
	const tagged = message.mentions.users.first();
	const serverStats = require("../utils/schemas/serverstat.js");
	const fs = require("fs");
	const queries = require('../utils/queries/queries');

	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
		if(!tagged) return message.channel.send("Please Tag A User To Add To Their Eggs!");
		if(isNaN(args[1])) return message.channel.send("Argument Entered was not A Number!");
	
		serverStats.findOneAndUpdate({
			guildId: message.guild.id, 
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
	aliases: ['ae'],
	desc: "Egg Event: Adds to the tagged users egg count",
	usage: "!!addeggs (user) (amount)",
	hidden: "true"
}