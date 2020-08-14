exports.run = async (client, message, args) => {
    const tagged = message.mentions.users.first();
	const tierArg = args[1].toLowerCase();
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

	const banDate = {
		dd: dd,
		mm: mm,
		yyyy: yyyy
	}

	let dbResConfig = await serverConfig.findOne({
		guildId: message.guild.id
	});
	let dbResStats = await serverStats.findOne({
		guildId: message.guild.id
	});
	const tierIndex = dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg);
	console.log(`${tierArg}: ${tierIndex}`);
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
	if(dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg) == -1) return message.channel.send("Tier Not Found! Try Again");

	
	if(!dbResConfig || dbResConfig.mutedRole == "blank") {
		message.author.send({embed: {
			color: 0xff0000,
			author: {
			  name: client.user.username,
			  icon_url: client.user.avatarURL
			},
			title: `Laela's Watchdog's`,
			timestamp: new Date(),
			fields: [
				{
					name: 'ERROR:',
					value: "The Server Admins have NOT set the muted role. Please DM and Admin for info! (Or not tell them and evade your mute [This is between you and me though 😉",
					
				}
			],
			footer: {
			  icon_url: client.user.avatarURL,
			  text: client.user.username
			},
		  }
		});
		return;
	}


	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tempmute");
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
				name: 'Reason:',
				value: reason,
				
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
		const userIndex = dbResStats.guildMembers.findIndex(user => user.userID === tagged.id);

		const reaction = collected.first().emoji.name;
		console.log(reaction);
		if(collected.first().emoji.name == '✅') {
		

			

            message.channel.createInvite({
				maxAge: 86400,
				maxUses: 1
			}).then(function(newInvite){
				console.log(dbResStats.guildMembers[userIndex].punishmentsTiers[dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)]);
				
				const tierArray = dbResConfig.serverTiers[tierIndex].TierTimes

				console.log("The Tier: " + dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg));

				

				console.log(dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg));

				let inviteStr = ("https://discord.gg/" + newInvite.code)

				const lastTier = (typeof dbResStats.guildMembers[userIndex].punishmentsTiers[dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)] === 'undefined')? 0 : dbResStats.guildMembers[userIndex].punishmentsTiers[dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)].tierLevel;
				let seconds = matchTier(dbResStats, dbResConfig, tierIndex, lastTier);
				addTier(client, message, tagged, dbResStats, userIndex, tierArg, serverStats, dbResConfig, tierIndex, banDate, lastTier, seconds);
				
				console.log(`Last Tier: ${lastTier}`);


				

				
				console.error(matchTier(dbResStats, dbResConfig, tierIndex, lastTier));
				tagged.send({embed: {
				color: 0xff0000,
				author: {
				  name: client.user.username,
				  icon_url: client.user.avatarURL
				},
				title: `You Have Been (Temp) Muted!`,
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
            }).then(async msg => {	


				if(dbResStats.logChannel != "blank") {
					let logChannel = client.channels.cache.get(dbResConfig.logChannel);

					logChannel.send({embed: {
						color: 0xff0000,
						author: {
						  name: client.user.username,
						  icon_url: client.user.avatarURL
						},
						description: `Tier By: ${message.author}`,
						title: `User: ${tagged}`,
						timestamp: new Date(),
						fields: [
							{
								name: `Tier (T${lastTier + 1}):`,
								value: dbResConfig.serverTiers[tierIndex].TierName,
							},
							{
								name: 'Time:',
								value: matchTier(dbResStats, dbResConfig, tierIndex, lastTier),
								
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

				await (message.mentions.members.first()._roles).forEach(role => {
					message.mentions.members.first().roles.remove(role);
				});
				message.mentions.members.first().roles.add(dbResConfig.mutedRole);
				let dbResStatsUpdate = await serverStats.findOne({
					guildId: message.guild.id
				});
				const mentionedTier = (dbResStatsUpdate.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg) == -1) ? 0 : dbResStatsUpdate.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg); 
				console.log(mentionedTier);
                await setTimeout(() => {
                    try {
						console.log(dbResStatsUpdate.guildMembers[userIndex].punishmentsTiers);
						message.mentions.members.first().roles.remove(dbResConfig.mutedRole);
						(dbResStatsUpdate.guildMembers[userIndex].punishmentsTiers[mentionedTier].pastRoles).forEach(role => {
							message.mentions.members.first().roles.add(role);
						});
                    } catch(err) {console.log(err);}
                }, seconds);

			});
			});
		}
	if(collected.first().emoji.name == '❌') {
		message.channel.send(`Tiermute Canceled. Well I guess ${tagged} is VERY lucky...`);
	}
					
}).catch((err) => {
	console.log(err);
	message.channel.send(`Tiermute Cancelled. You Were Timed Out`);
});
	  });
	}
}

module.exports.help = {
	name: "Tier Mute",
	desc: "Mutes the User for the Tier Time (WARNING: This feature is experimental. Do NOT Use it for real yet) [ALSO, DO NOT JOKE WITH THIS COMMAND. This can lead to adding a tier NO MATTER WHAT!]",
	usage: "l^tiermute (user) (tier)"
}


const matchTier = (dbResStats, dbResConfig, tierIndex, lastTier) => {
	console.log("Running");
	if(parseInt(lastTier) >= (parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) - 1)) {
		console.log("above tier");
		return (dbResConfig.serverTiers[tierIndex].TierTimes[parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) -1])
	} else {
		console.log("below tier: " + dbResConfig.serverTiers[tierIndex].TierTimes);
		console.log("Last Tier: " + lastTier);
		return dbResConfig.serverTiers[tierIndex].TierTimes[lastTier]
	}
};


const addTier = async(client, message, tagged, dbResStats, userIndex, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds) => {

	if((dbResStats.guildMembers[userIndex].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)) == -1) {
		console.log("Adding to set");
		serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": tagged.id} , {
			$addToSet:{
			  "guildMembers.$.punishmentsTiers": {
				tierName: dbResConfig.serverTiers[tierIndex].TierName,
				dateOfTier: date.mm + '/' + date.dd + '/' + date.yyyy,
				tierLevel: 1,
				TierForgiveness: (dbResConfig.serverTiers[tierIndex].TierForgiveness*(lastTier + 1)),
				OffenderMsgCount: dbResStats.guildMembers[userIndex].messageCount,
				tierTime: seconds,
				pastRoles: message.mentions.members.first()._roles
			  }
			}}, {upsert: true}).exec();
		} else {
			console.log("Updating set");
			serverStats.updateOne({
				guildId: message.guild.id, 
				"guildMembers.userID": tagged.id,

			}, 
			{
				tierTime: seconds,
				pastRoles: message.mentions.members.first()._roles,
				$inc:{
				  "guildMembers.$.punishmentsTiers.$[punishmentName].tierLevel":1
				},
			 },
			  { "arrayFilters": [
					{ "punishmentName.tierName": dbResConfig.serverTiers[tierIndex].TierName }
				] }).exec();
		}

}