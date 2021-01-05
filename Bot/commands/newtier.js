exports.run = async (client, message, args) => {
//Defined Required Modules and Packages.
	const Discord = require("discord.js");
	const embedTemp = new Discord.MessageEmbed();
	const logEmbed = new Discord.MessageEmbed();
	const ms = require("ms");
	const mongoose = require('mongoose');

	const punishSchem = require("../utils/schemas/punishment");
	
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const queries = require("../utils/queries/queries.js");


	const tierArg = args[1].toLowerCase();
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const newText = args[0].replace('<@', '').replace('>', "").replace('!', "");
	const tagged = await message.guild.member(newText);

	const dbResConfig = await queries.queryServerConfig(message.guild.id);
	const user = await queries.queryUser(message.guild.id, tagged.id);

	const tierAction = require('../utils/queries/tierUtils/tierUtils.js');
	

	//Checks for Permissions and Args validity
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
		if(!args.length || !args[1]) return message.channel.send("No User Was Mentioned for the tiering");
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
		

		tierAction.addTier(client, message, user, tier, userRoles, tierArg, lastTier, tagged);
		const tierType = await tierAction.matchPunishment(tier, dbResConfig, lastTier);
		console.log(tierType);
			switch(tierType) {
				case "warning":
					await awaitWarn(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message);
				break;
				case "ban":
					await fillDB(punishSchem, "ban", await tierAction.matchTier(tier, dbResConfig, lastTier)/1000, tagged, reason, message, tier.serverTiers[0].TierName, mongoose);
					await awaitBan(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message);
				break;

				case "mute":
					await fillDB(punishSchem, "mute", await tierAction.matchTier(tier, dbResConfig, lastTier)/1000, tagged, reason, message, tier.serverTiers[0].TierName, mongoose);
					await awaitMute(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message);
				break;
			}
			
			logEmbed.setTitle(`User Tiered: ${tagged.displayName}`);
			logEmbed.setColor('RANDOM');
			logEmbed.setThumbnail("https://www.freeiconspng.com/thumbs/hammer-icon/hammer-icon-6.png");
			logEmbed.setDescription(`Mod: ${message.author}
			Type: ${tierType}
			Reason: ${reason}
			User @: ${tagged}
			`);
			if(dbResConfig) {
				client.channels.fetch(dbResConfig.logChannel).then(channel => {channel.send(logEmbed)});
			}

			embedTemp.setTitle("You Have Been Tiered!");
			embedTemp.setColor("#ff0000");
			embedTemp.setDescription(`Mod: ${message.author}`)
			embedTemp.addFields({ name: `Tier:`, value: `${tierArg}`, inline: false });
			embedTemp.addFields({ name: `Type:`, value: `${await tierAction.matchPunishment(tier, dbResConfig, lastTier)}`, inline: false });
			embedTemp.addFields({ name: `Time:`, value: `${ms(await tierAction.matchTier(tier, dbResConfig, lastTier))}`, inline: false });
			embedTemp.addFields({ name: `Reason:`, value: `${reason}`, inline: false });
			tagged.send(embedTemp);
		

	}
};


const awaitWarn = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message) => {
	message.channel.send(`Sucessfully Warned <@${tagged.id}> for T${lastTier + 1}`);
}

const  awaitMute = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message) => {

	if(!tagged.roles.cache.has(dbResConfig.mutedRole)) {
		try {
			await tagged.roles.set([]).then(()=> {
			tagged.roles.add(dbResConfig.mutedRole);
			});
		} catch(err) {
				tagged.roles.add(dbResConfig.mutedRole);
				console.log("Cant Remove this Boi");
			}
		}
		
	
	message.channel.send(`Sucessfully muted <@${tagged.id}> for T${lastTier + 1}`);
}


const awaitBan = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message) => {
	await tagged.ban(reason).catch(err => {
		message.channel.send("Cant Kick User: Higher Permissions");
		throw err;
	})
	message.channel.send(`Sucessfully banned <@${tagged.id}> for T${lastTier + 1} `);
}

module.exports.help = {
	name: "Tier User",
	type: "moderation",
	desc: "Punishes the User for the Tier Time and Tier Type (ban, mute, warn, etc)",
	usage: "!!tier (user) (tier)",
	aliases: ["nt"]
}

	

const fillDB = async(punishSchem, type, time, tagged, reason, message, tier, mongoose) => {
	const expires = new Date();
	console.log(time);
	expires.setSeconds(expires.getSeconds() + time);
	await new punishSchem({
		_id: mongoose.Types.ObjectId(),
		userID: tagged.id,
		reason,
		guildID: message.guild.id,
		modID: message.author.id,
		type,
		tier,
		expires,
		stale: false
	}).save();
}