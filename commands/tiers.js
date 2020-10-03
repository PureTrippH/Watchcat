exports.run = async (client, message, args) => {
    const fs = require("fs");
	const ms = require("ms");
	const Discord = require('discord.js');
	const serverStats = require("../utils/schemas/serverstat.js");
	const queries = require("../utils/queries/queries.js");

    const tierList = new Discord.MessageEmbed();
	if(message.member.hasPermission('BAN_MEMBERS') && (args[0] != 'view' )) {
		tierList.setColor('#c9cf59');

		if(message.mentions.members.first()) {
			tierList.setTitle(`Userinfo: ${message.mentions.members.first().displayName}`);
			tierList.setThumbnail(message.mentions.users.first().avatarURL());
			let tagged = await queries.queryUser(message.guild.id, message.mentions.members.first().id);

			(tagged.guildMembers[0].punishmentsTiers).forEach(tier => {
				tierList.addFields(
					{ name: `Total Message Count:`, value: `${tagged.guildMembers[0].messageCount}`},
					{ name: `${tier.tierName} - Level: ${tier.tierLevel}`, value: `Message Count - (${tagged.guildMembers[0].messageCount - tier.OffenderMsgCount}:${tier.TierForgiveness})`, inline: true }
				  )
			});
			message.channel.send(tierList);
			return;
		}

	const serverConfig = require("../utils/schemas/serverconfig.js");
	const dbRes = await serverConfig.findOne({
		guildId: message.guild.id
	});

	tierList.setColor('#c9cf59');
	tierList.setTitle("Laela's Watchdog's Tiers (This Server)");

	dbRes.serverTiers.forEach(tier => {
		tierList.addFields(
			{ name: `${tier.TierName}`, value: `${ms(tier.TierTimes)}`, inline: false }
		  )
		tierList.addFields(
			{ name: `${tier.TierName} Forgiveness`, value: `${tier.TierForgiveness} Messages`, inline: false }
		  )
	});

	message.channel.send(tierList);


}
 else {
	tierList.setTitle(`Active Tiers`);
	tierList.setColor('#c9cf59');
	
	const user = await serverStats.findOne(
		{
		   guildId: message.guild.id,
		  "guildMembers.userID": message.author.id
	  }, 
		{
		  guildMembers: {
			$elemMatch: 
			{
			  userID: message.author.id
			}}});

			(user.guildMembers[0].punishmentsTiers).forEach(tier => {
				tierList.addFields(
					{ name: `${tier.tierName} - Level: ${tier.tierLevel}`, value: `Message Count - (${user.guildMembers[0].messageCount - tier.OffenderMsgCount}:${tier.TierForgiveness})`, inline: true }
				  )
			})
		if((user.guildMembers[0].punishmentsTiers).length == 0) message.author.send('No Tiers Found');
		console.log(user.guildMembers[0].punishmentsTiers);
		message.author.send(tierList);
	}

	
}

module.exports.help = {
	name: "Tiers",
	type: "moderation",
	desc: "Shows server tiers",
	usage: "!!tiers (view)"
}