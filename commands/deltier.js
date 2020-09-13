exports.run = async (client, message, args) => {
	const tierArg = args[1].toLowerCase();
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const fs = require("fs");
	const date = new Date();
	const ms = require("ms");
	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const serverStats = require("../utils/schemas/serverstat.js");

	let dbResConfig = await serverConfig.findOne({
		guildId: message.guild.id
	});
	let dbResStats = await serverStats.findOne({
		guildId: message.guild.id
	});
	let newText = args[0].replace('<@!', '').replace('>', "");
	const tagged = await message.guild.member(newText);
	const userIndex = dbResStats.guildMembers.findIndex(user => user.userID === tagged.id);
	const tierIndex = dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg);
	const selectedIndex = dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg);
	const user = await serverStats.findOne(
		{
		   guildId: message.guild.id,
		  "guildMembers.userID": message.author.id
	  }, 
		{
		  guildMembers: {
			$elemMatch: 
			{
			  userID: tagged.id
			}}});


	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
	console.log(`${tierArg}: ${tierIndex}`);
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
	if(dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg) == -1) return message.channel.send("Tier Not Found! Try Again");
	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tiering");


	await removedTierFromUser(client, message, tagged, dbResConfig, dbResStats, user, serverStats, tierIndex, tierArg, selectedIndex);
	const banList = await message.guild.fetchBans();
	if(banList.find(user => user.id === newText)) {
		message.guild.members.unban(tagged.id, {reason: "They have served their sentence"});
		return;
	} else if(tagged.roles.cache.has(dbResConfig.mutedRole)) {
		tagged.roles.remove(dbResConfig.mutedRole);
		(dbResStats.guildMembers[0].punishmentsTiers[selectedIndex].pastRoles).forEach(role => {
			tagged.roles.add(role);
		});
	}
	}
}; 
}

module.exports.help = {
	name: "Delete Tier",
	type: "moderation",
	desc: "Deletes a Users Tier",
	usage: "!!deltier (user) (tier)"
}



const removedTierFromUser = async(client, message, tagged, dbResConfig, dbResStats, user, serverStats, tierIndex, tierArg, selectedIndex) => {

	console.log(selectedIndex);
	if(selectedIndex == -1) return message.channel.send("User doesn't have this tiers.");
	if(user.guildMembers[0].punishmentsTiers[selectedIndex] == []) return message.channel.send("User has no tiers.");
	if(user.guildMembers[0].punishmentsTiers[selectedIndex].tierLevel <= 0) {
	serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": tagged.id} , {
		$pull:{
		  "guildMembers.$.punishmentsTiers": {
			tierName: dbResConfig.serverTiers[tierIndex].TierName,
		  }
		}}, {upsert: true}).exec();
	 } else {
		console.log("Updating set");
		serverStats.updateOne({
			guildId: message.guild.id, 
			"guildMembers.userID": tagged.id,

		}, 
		{
			$inc:{
			  "guildMembers.$.punishmentsTiers.$[punishmentName].tierLevel":-1
			},
		 },
		  { "arrayFilters": [
				{ "punishmentName.tierName": dbResConfig.serverTiers[tierIndex].TierName }
			] }).exec();
	}
	try {
		console.log(user.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles);
		(user.guildMembers[0].punishmentsTiers[selectedIndex].pastRoles.arrayOfRoles).forEach(role => {
			tagged.roles.add(role);
		});
	} catch(err) {console.log(err);}
	message.channel.send(`Sucessfully removed tier T${dbResStats.guildMembers[userIndex].punishmentsTiers[selectedIndex].tierLevel}`);
};
