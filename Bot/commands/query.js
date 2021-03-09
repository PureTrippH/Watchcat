exports.run = async (client, message, args) => {
	const fs = require("fs");
	const serverStats = require('../utils/schemas/serverstat.js');
	const serverConfig = require('../utils/schemas/serverconfig.js');
	const ms = require("ms");
	const queries = require('../utils/queries/queries');
	const query = await queries.queryUser(message.guild.id, message.author.id);
	const Discord = require('discord.js');
	const ping = new Discord.MessageEmbed;
	ping.setColor('#c9cf59');
	ping.setTitle("Bot Stats");
	let pingTime = Date.now() - message.createdTimestamp;
	ping.addFields(
		{ name: `Query Info (User Id):`, value: `${query.guildMembers[0].userID}`, inline: false },
		{ name: `Ping:`, value: `${pingTime}ms`, inline: false },
	  );
		
	const queryServerStats = await serverStats.findOne({
    	guildId: message.guild.id
  	}, (err, guildStats) => {
    	if(!guildStats) {
     	 console.log("No Data Found!");
      	//Creates a New Stats Schema
      	const newStats = new serverStats({
    		 _id: mongoose.Types.ObjectId(),
        	guildId: message.guild.id,
        	messageCountTotal: 0,
        	guildMembersInt: client.guilds.cache.get(guild).memberCount,
        	guildMembers: []
		  });
    	newStats.save();
    }}).lean();
console.log(queryServerStats);


	serverStats.createIndexes({ "guildId": message.guild.id, "guildMembers.userID": message.author.id});  
	message.channel.send(ping);

}
	

module.exports.help = {
	name: "Query",
	aliases: [],
	type: "utility",
	desc: "Queries your Information (Meant for testing)",
	usage: "!!query",
	hidden: "true"
};