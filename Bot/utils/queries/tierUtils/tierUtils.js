const serverStats = require("../../schemas/serverstat.js");


//Function to globally query the User in that server, and pass the information down to every command



const addTier = async(client, message, user, tier, userRoles, tierArg, lastTier, tagged) => {
	if(user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg) == -1) {
		console.log("ITS TRUE!");
		console.log(`Tier Name: ${tier.serverTiers[0].TierName}`);
		console.log(`Tier Forgiveness: ${tier.serverTiers[0].TierForgiveness*(lastTier + 1)}`);

		console.log("Adding to set");
		serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": tagged.id} , {
			$addToSet:{
			"guildMembers.$.punishmentsTiers": {
				tierName: tier.serverTiers[0].TierName,
				tierLevel: 1,
				TierForgiveness: tier.serverTiers[0].TierForgiveness*(lastTier + 1),
				OffenderMsgCount: user.guildMembers[0].messageCount,
				tierTime: tier.serverTiers[0].TierTimes[(lastTier + 1)],
				pastRoles: userRoles
			}
		}}, {upsert: true}).exec();
	} else {
		console.log("Updating set");
		serverStats.updateOne({
			guildId: message.guild.id, 
			"guildMembers.userID": tagged.id,
		}, 
		{
			"guildMembers.$.punishmentsTiers.$[punishmentName].pastRoles": userRoles,
			"guildMembers.$.punishmentsTiers.$[punishmentName].tierTime": tier.serverTiers[0].TierTimes[(lastTier + 1)],
			$inc:{
				"guildMembers.$.punishmentsTiers.$[punishmentName].tierLevel":1
			},
			},
			{ "arrayFilters": [
				{ "punishmentName.tierName": (tier.serverTiers[0].TierName) }
			] }).exec();
		}

}

const matchTier = async(tier, dbResConfig, lastTier) => {
	if(parseInt(lastTier) >= (parseInt(tier.serverTiers[0].TierTimes.length) - 1)) {
		return (tier.serverTiers[0].TierTimes[parseInt(tier.serverTiers[0].TierTimes.length) -1])
	} else {
		return tier.serverTiers[0].TierTimes[lastTier]
	}
};

	//Gets the Type of Punishment
const matchPunishment = async(tier, dbResConfig, lastTier) => {
	if(parseInt(lastTier) >= (parseInt(tier.serverTiers[0].banOrMute.length) - 1)) {
		return (tier.serverTiers[0].banOrMute[parseInt(tier.serverTiers[0].banOrMute.length) -1])
	} else {
		return tier.serverTiers[0].banOrMute[lastTier]
	}
};


module.exports = {addTier, matchTier, matchPunishment}

//Hi