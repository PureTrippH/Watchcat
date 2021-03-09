exports.run = async (client, message, args) => {
//Defined Required Modules and Packages.
	const ms = require("ms");
	const redis = require('../utils/redis');
	const serverStats = require("../utils/schemas/serverstat.js");
	const queries = require("../utils/queries/queries.js");

	const tierArg = args[1].toLowerCase();
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const newText = args[0].replace('<@', '').replace('>', "").replace('!', "");
	const tagged = await message.guild.member(newText);

	const dbResConfig = await queries.queryServerConfig(message.guild.id);
	const user = await queries.queryUser(message.guild.id, tagged.id);
	
	const date = new Date();
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0'); 
	const yyyy = date.getFullYear();
	const banDate = { dd: dd, mm: mm, yyyy: yyyy}
	const tierIndex = dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg);

	//Checks for Permissions and Args validity
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
	if(dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg) == -1) return message.channel.send("Tier Not Found! Try Again");
	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tiering");

        message.channel.createInvite({
			maxAge: 86400,
			maxUses: 1
		}).then (async function(newInvite){
			let inviteStr = ("https://discord.gg/" + newInvite.code);
			const lastTier = (typeof user.guildMembers[0].punishmentsTiers[user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)] === 'undefined')? 0 : user.guildMembers[0].punishmentsTiers[user.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg)].tierLevel;
			const seconds = matchTier(user, dbResConfig, tierIndex, lastTier);

			//Adds the Tier to the User
			addTier(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, banDate, lastTier, seconds);

			if(user.logChannel != "blank") {
				const logChannel = client.channels.cache.get(dbResConfig.logChannel);
				//Creates Log Channel Embed
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
							name: `Tier:`,
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
			let redisClient = await redis();
			switch(tierType) {
				case "warning":
					await awaitWarn(client, message, tagged, user, date, lastTier, reason, args);
				break;
				case "ban":
					await awaitBan(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms, redisClient);
				break;

				case "mute":
					await awaitMute(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms, redisClient);
				break;
			}
			redisClient.quit();
		});
	}
};

module.exports.help = {
	name: "Tier User",
	type: "moderation",
	desc: "Punishes the User for the Tier Time and Tier Type (ban, mute, warn, etc)",
	usage: "!!tier (user) (tier)",
	aliases: ["t"],
	hidden: "true"
}

/*-----------------------------------------------
Definition of Functions
-----------------------------------------------*/

	//Get the Tier the Current User is on
const matchTier = (user, dbResConfig, tierIndex, lastTier) => {
	if(parseInt(lastTier) >= (parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) - 1)) {
		return (dbResConfig.serverTiers[tierIndex].TierTimes[parseInt(dbResConfig.serverTiers[tierIndex].TierTimes.length) -1])
	} else {
		return dbResConfig.serverTiers[tierIndex].TierTimes[lastTier]
	}
};

	//Gets the Type of Punishment
const punishVar = (user, dbResConfig, tierIndex, lastTier) => {
	if(parseInt(lastTier) >= (parseInt(dbResConfig.serverTiers[tierIndex].banOrMute.length) - 1)) {
		return (dbResConfig.serverTiers[tierIndex].banOrMute[parseInt(dbResConfig.serverTiers[tierIndex].banOrMute.length) -1])
	} else {
		return dbResConfig.serverTiers[tierIndex].banOrMute[lastTier]
	}
};



//Adds Tier to the User
const addTier = async(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds) => {
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

const awaitBan = async(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms, redisClient) => {
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
				name: `Tier ${lastTier + 1}:`,
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
	try {
		const redisKey = `banned-${tagged.id}-${message.guild.id}`

		redisClient.set(redisKey, 'true', 'EX', (seconds / 1000));
	} finally {
	}

	await tagged.ban(reason).catch(err => {
		message.channel.send("Cant Kick User: Higher Permissions");
		throw err;
	})
	message.channel.send(`Sucessfully banned <@${tagged.id}> for T${lastTier + 1}`);
	
	//Ik its repetitive to have this declared twice but idc rn. I need to get this done ASAP for the server.
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
	


const awaitMute = async(client, message, tagged, user, tierArg, serverStats, dbResConfig, tierIndex, date, lastTier, seconds, reason, args, inviteStr, ms, redisClient) => {
	tagged.send({embed: {
		color: 0xff0000,
		author: {
		name: client.user.username,
		icon_url: client.user.avatarURL
		},
		title: `You Have Been Tiered!`,
		timestamp: new Date(),
		fields: [
			{
				name: `Tier ${lastTier + 1}:`,
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
		try {
			await tagged.roles.set([]).then(()=> {
			tagged.roles.add(dbResConfig.mutedRole);
			});
		} catch(err) {
				console.log("Cant Remove this Boi");
			}
		}
		
		
		const redisKey = `muted-${tagged.id}-${message.guild.id}-${tierArg}`
		redisClient.set(redisKey, 'true', 'EX', (seconds / 1000));
		message.channel.send(`Sucessfully muted <@${tagged.id}> for T${lastTier + 1}`);
		console.log(redisClient.connected);
		
}
	

