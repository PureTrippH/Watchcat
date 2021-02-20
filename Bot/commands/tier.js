exports.run = async (client, message, args) => {
//Defined Required Modules and Packages.
	const Discord = require("discord.js");

	const embedTemp = new Discord.MessageEmbed();
	const logEmbed = new Discord.MessageEmbed();
	const chatEmbed = new Discord.MessageEmbed();

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
		if(!args.length || !args[1]) return message.channel.send("No User Was Mentioned for the tiering or no tier found");
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
			let inv = await message.channel.createInvite(
				{
					maxAge: 604800,
					maxUses: 1
				});
			embedTemp.setTitle(`Tier: ${args[1]}`);
			embedTemp.setColor("#ff0000");
			embedTemp.setThumbnail(message.guild.iconURL());
			embedTemp.setDescription(`
			Server: ${message.guild}
			Mod: ${message.author}`)
			embedTemp.addFields({ name: `Tier:`, value: `${tierArg}`, inline: false });
			embedTemp.addFields({ name: `Type:`, value: `${await tierAction.matchPunishment(tier, dbResConfig, lastTier)}`, inline: false });
			embedTemp.addFields({ name: `Time:`, value: `${ms(await tierAction.matchTier(tier, dbResConfig, lastTier))}`, inline: false });
			embedTemp.addFields({ name: `Reason:`, value: `${reason}`, inline: false });
			embedTemp.setFooter(`Server Invite if Needed - ${inv}`);
			tagged.send(embedTemp);

		tierAction.addTier(client, message, user, tier, userRoles, tierArg, lastTier, tagged);
		const tierType = await tierAction.matchPunishment(tier, dbResConfig, lastTier);
		console.log(tierType);
		chatEmbed.setColor('RANDOM');
		chatEmbed.setThumbnail("https://cdn.discordapp.com/attachments/709865845504868447/799855951967420446/0B36A559-0C8C-471A-8F99-F599072F0755.jpeg");
			switch(tierType) {
				case "warning":
					await awaitWarn(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message, chatEmbed);
				break;
				case "ban":
					await fillDB(punishSchem, "ban", await tierAction.matchTier(tier, dbResConfig, lastTier)/1000, tagged, reason, message, tier.serverTiers[0].TierName, mongoose);
					await awaitBan(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message, chatEmbed);
				break;

				case "mute":
					await fillDB(punishSchem, "mute", await tierAction.matchTier(tier, dbResConfig, lastTier)/1000, tagged, reason, message, tier.serverTiers[0].TierName, mongoose);
					await awaitMute(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message, chatEmbed);
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

			chatEmbed.setTitle(`Tier ${lastTier+1}: ${tagged.displayName}`);
			chatEmbed.addFields({ name: `Time:`, value: `${ms(await tierAction.matchTier(tier, dbResConfig, lastTier))}`, inline: false });
			message.channel.send(chatEmbed);
			
		

	}
};


const awaitWarn = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message, chatEmbed) => {
	chatEmbed.setDescription(`Sucessfully Warned <@${tagged.id}> for T${lastTier + 1}`);
}

const  awaitMute = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message, chatEmbed) => {

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
		
		
		chatEmbed.setDescription(`Sucessfully muted <@${tagged.id}> for T${lastTier + 1}`);
}


const awaitBan = async(tierAction, embedTemp, tier, tagged, reason, tierArg, dbResConfig, lastTier, ms, message, chatEmbed) => {
	await tagged.ban(reason).catch(err => {
		message.channel.send("Cant Kick User: Higher Permissions");
		throw err;
	})
	chatEmbed.setDescription(`Sucessfully banned <@${tagged.id}> for T${lastTier + 1} `);
}

module.exports.help = {
	name: "Tier User",
	type: "moderation",
	desc: `A Tier is Part of the Watchcat Punishment System. Essentially, A Tier is a Stacked Punishment which can decay after a certain amount of activity (Voice chat or Messages). 
	A tier can start out as a warning, but can quickly spiral into something like a ban, mute, or another warning (You specificy which it is) if your tier does not decay. You can create and edit tiers to your liking with !!config.`,
	usage: "!!tier (user) (tier)",
	aliases: ["t"],
	gif: "https://cdn.discordapp.com/attachments/812814054597984256/812814418278613042/2021-02-20_17-33-13.gif"
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