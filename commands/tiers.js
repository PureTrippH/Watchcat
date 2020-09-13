exports.run = async (client, message, args) => {
    const fs = require("fs");
	const ms = require("ms");
	const Discord = require('discord.js');

    const tierList = new Discord.MessageEmbed();

	const serverConfig = require("../utils/schemas/serverconfig.js");
	const dbRes = await serverConfig.findOne({
		guildId: message.guild.id
	});

	tierList.setColor('#c9cf59');
	tierList.setTitle("Laela's Watchdog's Tiers (This Server)");

	dbRes.serverTiers.forEach(tier => {
		tierList.addFields(
			{ name: `${tier.TierName}`, value: `${tier.TierTimes}`, inline: false }
		  )
		tierList.addFields(
			{ name: `${tier.TierName} Forgiveness`, value: `${tier.TierForgiveness} Messages`, inline: false }
		  )
	})

	message.channel.send(tierList);


}


module.exports.help = {
	name: "Tiers",
	type: "moderation",
	desc: "Shows server tiers",
	usage: "!!tiers"
}