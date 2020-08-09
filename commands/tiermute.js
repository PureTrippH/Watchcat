exports.run = async (client, message, args) => {
    const tagged = message.mentions.users.first();
    const tierArg = args[1];
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const fs = require("fs");
	const date = new Date();
	const ms = require("ms");
	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const serverStats = require("../utils/schemas/serverstat.js");

	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
	const yyyy = date.getFullYear();

	let dbResConfig = await serverConfig.findOne({
		guildId: message.guild.id
	});
	let dbResStats = await serverStats.findOne({
		guildId: message.guild.id
	});
	const tierIndex = dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg)
	if(dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg) == -1) return message.channel.send("Tier Not Found! Try Again");
	if(!message.member.hasPermission('BAN_MEMBERS') || message.author.id != '168695206575734784') return message.channel.send("Did you really try to tempban as a regular. Come on...");
	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tempban");
	if(!dbResConfig || dbResConfig.mutedRole == "blank") return message.channel.send("Muted Role was not Defined in Config");
	else return message.channel.send({embed: {
		color: 0xff0000,
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: `Tier Mute: ${tagged ? tagged.username : null}`,
		timestamp: new Date(),
		fields: [
			{
				name: 'Tier:',
				value: dbResConfig.serverTiers[tierIndex].TierName,
				
			},
			{
				name: 'Confirm?',
				value: "React with :white_check_mark: to confirm",
				
			}
		],
		footer: {
		  icon_url: client.user.avatarURL,
		  text: client.user.username
		},
	  }
	}).then(msg => {
		msg.react('✅');
		msg.react('❌');
		
		msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
	  { max: 1, time: 50000 }).then(collected => {
		const reaction = collected.first().emoji.name;
		console.log(reaction);
		if(collected.first().emoji.name == '✅') {
		const userIndex = dbResStats.guildMembers.findIndex(user => user.userID === tagged.id);
		console.log(dbResStats.guildMembers[userIndex].punishmentsTiers);
		if((dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)) == -1) {
			console.log("Adding to set");
			serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": tagged.id} , {
				$addToSet:{
				  "guildMembers.$.punishmentsTiers": {
					tierName: dbResConfig.serverTiers[tierIndex].TierName,
					dateOfTier: mm + '/' + dd + '/' + yyyy,
					tierLevel: 1
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
					  "guildMembers.$.punishmentsTiers.$[punishmentName].tierLevel":1
					},
				 },
				  { "arrayFilters": [
						{ "punishmentName.tierName": dbResConfig.serverTiers[tierIndex].TierName }
					] }).exec();
			}
            message.channel.createInvite({
				maxAge: 86400,
				maxUses: 1
			}).then(function(newInvite){
				let inviteStr = ("https://discord.gg/" + newInvite.code)
				const lastTier = dbResStats.guildMembers[userIndex].punishmentsTiers[dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)].tierLevel;
			tagged.send({embed: {
				color: 0xff0000,
				author: {
				  name: client.user.username,
				  icon_url: client.user.avatarURL
				},
				title: `You Have Been (Temp) Banned!`,
				timestamp: new Date(),
				fields: [
					{
						name: 'Tier:',
						value: dbResConfig.serverTiers[tierIndex].TierName,
					},
                    {
						name: 'Time:',
						value: matchTier(dbResStats, dbResConfig, tierIndex, lastTier),
						
					},
                    {
						name: 'Invite:',
						value: inviteStr,
						
					},
				],
				footer: {
				  icon_url: client.user.avatarURL,
				  text: client.user.username
				},
              }
            }).then(async msg => {	
				
				console.log("The Tier: " + dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg));

				

				let seconds = matchTier(dbResStats, dbResConfig, tierIndex, lastTier)

				console.log(dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg));

				await message.mentions.members.first().ban(reason)

				const tierArray = dbResConfig.serverTiers[tierIndex].TierTimes
				console.log((dbResConfig.serverTiers[tierIndex].TierTimes[parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) -1]))
                setTimeout(() => {
                    try {
                    message.guild.members.unban(message.mentions.members.first().id, {reason: "They have served their sentence"});
                    } catch(err) {console.log(err);}
                }, (seconds));

			});
			});
		}
	if(collected.first().emoji.name == '❌') {
		message.channel.send(`Tempban Canceled. Well I guess ${tagged} is VERY lucky...`);
	}
					
}).catch((err) => {
	console.log(err);
	message.channel.send(`Tempban Cancelled. You Were Timed Out`);
});
	  });
}

module.exports.help = {
	name: "Tier Ban",
	desc: "Bans the User for the Tier Time (WARNING: This feature is experimental. Do NOT Use it for real yet) [ALSO, DO NOT JOKE WITH THIS COMMAND. This can lead to adding a tier NO MATTER WHAT!]",
	usage: "l^tierban (user) (tier)"
}


const matchTier = (dbResStats, dbResConfig, tierIndex, lastTier) => {
	if(dbResConfig.serverTiers[tierIndex].TierTimes[lastTier] >= (parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) - 1)) {
		return dbResConfig.serverTiers[tierIndex].TierTimes[parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) - 1]
	} else {
		return dbResConfig.serverTiers[tierIndex].TierTimes[lastTier]
	}
};