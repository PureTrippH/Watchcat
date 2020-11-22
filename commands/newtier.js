exports.run = async (client, message, args) => {
//Defined Required Modules and Packages.
	const Discord = require("discord.js");
	const embedTemp = new Discord.MessageEmbed();
	const ms = require("ms");
	
	const redis = require('../utils/redis');
	const serverStats = require("../utils/schemas/serverstat.js");
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const queries = require("../utils/queries/queries.js");

	if(!args.length || !args[1]) return message.channel.send("No User Was Mentioned for the tiering");

	const tierArg = args[1].toLowerCase();
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const newText = args[0].replace('<@', '').replace('>', "").replace('!', "");
	const tagged = await message.guild.member(newText);

	const dbResConfig = await queries.queryServerConfig(message.guild.id);
	const user = await queries.queryUser(message.guild.id, tagged.id);

	const tierAction = require('../utils/queries/tierUtils/tierUtils.js');

	const dependencies = {
		redis,
		ms,
	}
	

	//Checks for Permissions and Args validity
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {

	const tier = await serverConfig.findOne(
		{
		  guildId: message.guild.id,
		}, 
		{
		  serverTiers: {
			$elemMatch: 
			{
				TierName: tierArg
			}
		  }
		});

		if((tier.serverTiers).length == 0) return message.channel.send("No Tier Found");
		let punishArray = user.guildMembers[0].punishmentsTiers;
		let userRoles = tagged._roles;
		

		const lastTier = (typeof punishArray[punishArray.findIndex(tierObj => tierObj.tierName === tierArg)] === 'undefined')? 0 : punishArray[punishArray.findIndex(tierObj => tierObj.tierName === tierArg)].tierLevel;
		

		let redisClient = await redis();

		tierAction.addTier(client, message, user, tier, userRoles, tierArg, lastTier, tagged);
		const tierType = await tierAction.matchPunishment(tier, dbResConfig, lastTier);
		console.log(tierType);
			switch(tierType) {
				case "warning":
					await awaitWarn(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, redisClient, ms, message);
				break;
				case "ban":
					await awaitBan(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, redisClient, ms, message);
				break;

				case "mute":
					await awaitMute(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, redisClient, ms, message);
				break;
			}
			redisClient.quit();

	}
};


const awaitWarn = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, redisClient, ms, message) => {
	console.log("warn");
	embedTemp.setTitle("You Have Been Tiered!");
	embedTemp.setColor("#ff0000");
	embedTemp.addFields({ name: `Tier:`, value: `${tierArg}`, inline: false });
	embedTemp.addFields({ name: `Type:`, value: `${tierAction.matchPunishment(tier, dbResConfig, lastTier)}`, inline: false });
	embedTemp.addFields({ name: `Time:`, value: `${ms(await tierAction.matchTier(tier, dbResConfig, lastTier))}`, inline: false });
	embedTemp.addFields({ name: `Reason:`, value: `${reason}`, inline: false });
	tagged.send(embedTemp);
}

const  awaitMute = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, redisClient, ms, message) => {
	console.log("mute");
	embedTemp.setTitle("You Have Been Tiered!");
	embedTemp.setColor("#ff0000");
	embedTemp.addFields({ name: `Tier:`, value: `${tierArg}`, inline: false });
	embedTemp.addFields({ name: `Type:`, value: `${await tierAction.matchPunishment(tier, dbResConfig, lastTier)}`, inline: false });
	embedTemp.addFields({ name: `Time:`, value: `How much Time?: ${ms(await tierAction.matchTier(tier, dbResConfig, lastTier))}`, inline: false });
	embedTemp.addFields({ name: `Reason:`, value: `${reason}`, inline: false });
	tagged.send(embedTemp);

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
	redisClient.set(redisKey, 'true', 'EX', (await tierAction.matchTier(tier, dbResConfig, lastTier) / 1000));
	message.channel.send(`Sucessfully muted <@${tagged.id}> for T${lastTier + 1}`);
}


const awaitBan = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, redisClient, ms, message) => {
	console.log("ban");
	embedTemp.setTitle("You Have Been Tiered!");
	embedTemp.setColor("#ff0000");
	embedTemp.addFields({ name: `Tier:`, value: `${tierArg}`, inline: false });
	embedTemp.addFields({ name: `Type:`, value: `${tierAction.matchPunishment(tier, dbResConfig, lastTier)}`, inline: false });
	embedTemp.addFields({ name: `Time:`, value: `${ms(await tierAction.matchTier(tier, dbResConfig, lastTier))}`, inline: false });
	embedTemp.addFields({ name: `Reason:`, value: `${reason}`, inline: false });
	tagged.send(embedTemp);

	try {
		const redisKey = `banned-${tagged.id}-${message.guild.id}`

		redisClient.set(redisKey, 'true', 'EX', (await tierAction.matchTier(tier, dbResConfig, lastTier) / 1000));
	} finally {
	}

	await tagged.ban(reason).catch(err => {
		message.channel.send("Cant Kick User: Higher Permissions");
		throw err;
	})
	message.channel.send(`Sucessfully banned <@${tagged.id}> for T${lastTier + 1}`);
}

module.exports.help = {
	name: "Tier User",
	type: "moderation",
	desc: "Punishes the User for the Tier Time and Tier Type (ban, mute, warn, etc)",
	usage: "!!tier (user) (tier)",
	aliases: ["nt"]
}

	

