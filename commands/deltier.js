exports.run = async (client, message, args) => {
	const tierArg = args[1].toLowerCase();
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const fs = require("fs");
	const date = new Date();
	const ms = require("ms");
	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const serverStats = require("../utils/schemas/serverstat.js");
	const queries = require('../utils/queries/queries.js');

	let newText = args[0].replace('<@!', '').replace('>', "");

	const user = await queries.queryUser(message.guild.id, message.author.id);
	const dbResConfig = await queries.queryServerConfig(message.guild.id);
	const tagged = await message.guild.member(newText);
	const tierIndex = dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg);
	const selectedIndex = user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg);


	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
	if(dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg) == -1) return message.channel.send("Tier Not Found! Try Again");
	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tiering");
	console.log(user.guildMembers[0].punishmentsTiers);
	removedTierFromUser(client, message, tagged, dbResConfig, dbResStats, user, serverStats, tierIndex, tierArg, selectedIndex);
	}
}

module.exports.help = {
	name: "Delete Tier",
	aliases: [],
	type: "moderation",
	desc: "Deletes a Users Tier",
	usage: "!!deltier (user) (tier)"
}



const removedTierFromUser = async(client, message, tagged, dbResConfig, dbResStats, user, serverStats, tierIndex, tierArg, selectedIndex) => {

	console.log(selectedIndex);
	if(selectedIndex == -1) return message.channel.send("User doesn't have this tiers.");
	if(user.guildMembers[0].punishmentsTiers[selectedIndex] == []) return message.channel.send("User has no tiers.");
	if(user.guildMembers[0].punishmentsTiers[selectedIndex].tierLevel <= 1) {
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
		(user.guildMembers[0].punishmentsTiers[selectedIndex].pastRoles.arrayOfRoles).forEach(role => {
			tagged.roles.add(role);
		});
	} catch(err) {console.log(err);}
	message.channel.send(`Sucessfully removed tier T${dbResStats.guildMembers[userIndex].punishmentsTiers[selectedIndex].tierLevel}`);
};
