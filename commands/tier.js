exports.run = async (client, message, args) => {
	const tierArg = args[1].toLowerCase();
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const fs = require("fs");
	const date = new Date();
	const ms = require("ms");
	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const serverStats = require("../utils/schemas/serverstat.js");

	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0'); 
	const yyyy = date.getFullYear();
	let newText = args[0].replace('<@', '').replace('>', "").replace('!', "");
	console.log(newText);
	const tagged = await message.guild.member(newText);
	const banDate = {
		dd: dd,
		mm: mm,
		yyyy: yyyy
	}

	let dbResConfig = await serverConfig.findOne({
		guildId: message.guild.id
	});

	await serverStats.findOneAndUpdate(
		{
		  guildId: message.guild.id
		  }, 
			{
			  $addToSet: {
				guildMembers: {
				  userID: tagged.id,
				  messageCount: 1,
				  punishmentsTiers: [],
				  medals: []
				}
			  }
		  }).exec()

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


	const tierIndex = dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg);
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {

	if(dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg) == -1) return message.channel.send("Tier Not Found! Try Again");

	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tiering");
            message.channel.createInvite({
				maxAge: 86400,
				maxUses: 1
			}).then (async function(newInvite){
				console.log(user.guildMembers[0].punishmentsTiers[user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)]);
				
				const tierArray = dbResConfig.serverTiers[tierIndex].TierTimes

				console.log("The Tier: " + user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg));

				

				console.log(user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg));

				let inviteStr = ("https://discord.gg/" + newInvite.code)

				
				const lastTier = (typeof user.guildMembers[0].punishmentsTiers[user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)] === 'undefined')? 0 : user.guildMembers[0].punishmentsTiers[user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)].tierLevel;
				console.log(`HEY UR LAST TIER WAS ${lastTier}`);
				const seconds = matchTier(user, dbResConfig, tierIndex, lastTier);
				addTier(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, banDate, lastTier, seconds);



				if(user.logChannel != "blank") {
					let logChannel = client.channels.cache.get(dbResConfig.logChannel);

					logChannel.send({embed: {
						color: 0xff0000,
						author: {
						  name: client.user.username,
						  icon_url: client.user.avatarURL
						},
						description: `Tier By: ${message.author}`,
						title: `User: ${message.guild.member(tagged).displayName}`,
						timestamp: new Date(),
						fields: [
							{
								name: `Tier (T${lastTier + 1}):`,
								value: dbResConfig.serverTiers[tierIndex].TierName,
							},
							{
								name: 'Time:',
								value: ms(matchTier(user, dbResConfig, tierIndex, lastTier), { long: true }),
								
							},
							{
								name: 'Reason:',
								value: reason,
								
							}
						],
						footer: {
						  icon_url: client.user.avatarURL,
						  text: client.user.username
						},
					  }
					})
				}

				const tierType = punishVar(user, dbResConfig, tierIndex, lastTier);
				switch(tierType) {
					case "warning":
						awaitWarn(client, message, tagged, user, date, lastTier, reason, args);
					break;
					case "ban":
						awaitBan(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms);
					break;

					case "mute":
						awaitMute(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms);
					break;


				}

			});
		}

	  };

module.exports.help = {
	name: "Tier Ban",
	type: "moderation",
	desc: "Bans the User for the Tier Time (WARNING: This feature is experimental. Do NOT Use it for real yet) [ALSO, DO NOT JOKE WITH THIS COMMAND. This can lead to adding a tier NO MATTER WHAT!]",
	usage: "l^tierban (user) (tier)"
}


const matchTier = (user, dbResConfig, tierIndex, lastTier) => {
	console.log("Running");
	if(parseInt(lastTier) >= (parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) - 1)) {
		console.log("above tier: "+ dbResConfig.serverTiers[tierIndex].TierTimes[parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) -1]);
		return (dbResConfig.serverTiers[tierIndex].TierTimes[parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) -1])
	} else {
		console.log("below tier: " + dbResConfig.serverTiers[tierIndex].TierTimes);
		console.log("Last Tier: " + lastTier);
		return dbResConfig.serverTiers[tierIndex].TierTimes[lastTier]
	}
};

const punishVar = (user, dbResConfig, tierIndex, lastTier) => {
	console.log("Running");
	if(parseInt(lastTier) >= (parseInt(dbResConfig.serverTiers[tierIndex].banOrMute.length) - 1)) {
		return (dbResConfig.serverTiers[tierIndex].banOrMute[parseInt(dbResConfig.serverTiers[tierIndex].banOrMute.length) -1])
	} else {
		console.log("below tier: " + dbResConfig.serverTiers[tierIndex].banOrMute);
		console.log("Last Tier: " + lastTier);
		return dbResConfig.serverTiers[tierIndex].banOrMute[lastTier]
	}
};


const addTier = async(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, ms) => {
	console.log(tagged._roles);

	let arrayOfRoles = tagged._roles

	if((user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)) == -1) {
		console.log("Adding to set");
		serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": tagged.id} , {
			$addToSet:{
			  "guildMembers.$.punishmentsTiers": {
				tierName: dbResConfig.serverTiers[tierIndex].TierName,
				dateOfTier: date.mm + '/' + date.dd + '/' + date.yyyy,
				tierLevel: 1,
				TierForgiveness: (dbResConfig.serverTiers[tierIndex].TierForgiveness*(lastTier + 1)),
				OffenderMsgCount: user.guildMembers[0].messageCount,
				tierTime: seconds,
				pastRoles: arrayOfRoles
			  }
			}}, {upsert: true}).exec();
		} else {
			console.log("Updating set");
			serverStats.updateOne({
				guildId: message.guild.id, 
				"guildMembers.userID": tagged.id,
			}, 
			{
	
				$set:{
					"guildMembers.$.punishmentsTiers.$[punishmentName].pastRoles": {
						arrayOfRoles,
					},
				},
				"guildMembers.$.punishmentsTiers.$[punishmentName].tierTime": seconds,
				$inc:{
				  "guildMembers.$.punishmentsTiers.$[punishmentName].tierLevel":1
				},
			 },
			  { "arrayFilters": [
					{ "punishmentName.tierName": dbResConfig.serverTiers[tierIndex].TierName }
				] }).exec();
		}

}

const awaitBan = async(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms) => {
	await tagged.send({embed: {
		color: 0xff0000,
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: `You Have Been Tiered!`,
		timestamp: new Date(),
		fields: [
			{
				name: 'Tier:',
				value: dbResConfig.serverTiers[tierIndex].TierName,
			},
			{
				name: 'Time:',
				value: ms(matchTier(user, dbResConfig, tierIndex, lastTier), { long: true }),
				
			},
			{
				name: 'Reason:',
				value: reason,
				
			},
			{
				name: 'Invite (Expires When You Join Back):',
				value: inviteStr,
				
			},
		],
		footer: {
		  icon_url: client.user.avatarURL,
		  text: client.user.username
		},
	  }
	})

	tagged.send(`
	Tier: T${lastTier + 1}. 
	Time: ${matchTier(user, dbResConfig, tierIndex, lastTier)}. 
	Reason: ${reason}.
	Invite: ${inviteStr}
	`);

	await tagged.ban(reason)
	message.channel.send(`Sucessfully banned <@${tagged.id}> for T${lastTier + 1}`);
	console.log((dbResConfig.serverTiers[tierIndex].TierTimes[parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) -1]))
	setTimeout(() => {
		try {
		message.guild.members.unban(tagged.id, {reason: "They have served their sentence"});
		} catch(err) {console.log(err);}
	}, seconds);
}

const awaitWarn = async(client, message, tagged, user, date, lastTier, reason, args) => {
	tagged.send({embed: {
		color: 0xeba134,
		author: {
		  name: message.author.username,
		  icon_url: client.user.avatarURL
		},
		title: `Laela's Watchcat's`,
		timestamp: new Date(),
		description: `This Citation was created by: ${message.author}`,
		fields: [
		  {
			name: 'Citation on:',
			value: message.guild.name
		  },
			{
				name: 'Warning:',
				value: reason
			},
			{
				name: 'Tier:',
				value: args[1]
			}
		],
		footer: {
		  icon_url: client.user.avatarURL,
		  text: client.user.username
		},
	  }
	});

	message.channel.send(`Sucessfully warned <@${tagged.id}> for  Tier ${lastTier + 1}`);

	return;

};
	


const awaitMute = async(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms) => {
	console.log("Muted!");
	await tagged.send({embed: {
		color: 0xff0000,
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: `You Have Been Tiered!`,
		timestamp: new Date(),
		fields: [
			{
				name: 'Tier:',
				value: dbResConfig.serverTiers[tierIndex].TierName,
			},
			{
				name: 'Time:',
				value: ms(matchTier(user, dbResConfig, tierIndex, lastTier), { long: true }),
				
			},
			{
				name: 'Reason:',
				value: reason,
				
			},
			{
				name: 'Invite (Expires When You Join Back):',
				value: inviteStr,
				
			},
		],
		footer: {
		  icon_url: client.user.avatarURL,
		  text: client.user.username
		},
	  }
	});
if(!tagged.roles.cache.has(dbResConfig.mutedRole)) {
await (tagged._roles).forEach(role => {
	if(!(role == '725293383731380271')) {
		try {
		console.log(role);
		tagged.roles.remove(role);
		} catch(err) {
			console.log(`Probably Server Booster Role: ${err}`)
		} 
		} else {
			console.log("BOOSTER");
	} 
});
tagged.roles.add(dbResConfig.mutedRole);
}
let dbResStatsUpdate = await serverStats.findOne(
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
const mentionedTier = (dbResStatsUpdate.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg) == -1) ? 0 : dbResStatsUpdate.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg); 
const arrayVal = ((typeof dbResStatsUpdate.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles.arrayOfRoles) == 'undefined') ? dbResStatsUpdate.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles : dbResStatsUpdate.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles.arrayOfRoles
console.log(mentionedTier);
message.channel.send(`Sucessfully muted <@${tagged.id}> for T${lastTier + 1}`);

await setTimeout(() => {
	try {
		console.log((dbResStatsUpdate.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles));
		tagged.roles.remove(dbResConfig.mutedRole);
		(arrayVal).forEach(role => {
			if(!(role == '725293383731380271')) {
			try {
				tagged.roles.add(role);
			} catch(err) {
				console.log(`Probably Server Booster Role: ${err}`)
			}
			} 
		});
	} catch(err) {console.log(err);}
}, (seconds.MAX_SAFE_INTEGER));
}