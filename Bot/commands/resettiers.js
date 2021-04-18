exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const fetch = require('node-fetch');
	const embed = new Discord.MessageEmbed();
	const queries = require("../utils/queries/queries.js");
	const Stats = require('../utils/schemas/serverstat');
	
	let req = await Stats.findOne({
		guildId: message.guild.id
	})
	req.guildMembers.forEach(async user => {
		const newUser = await queries.queryUser(message.guild.id, user.userID);
		console.log(newUser);
		let punishArray = newUser.guildMembers[0].punishmentsTiers;
		punishArray.forEach(tier => {
			Stats.updateOne({
				guildId: message.guild.id, 
				"guildMembers.userID": user.userID,
			}, 
				{
				"guildMembers.$.punishmentsTiers.$[punishmentName].OffenderMsgCount": 150,
				},
				{ "arrayFilters": [
					{ "punishmentName.tierName": (tier.TierName) }
				] }).exec().then((err) => {
					console.log(`${err}: Set User to 0`);
				});
		})
		
		})
}

module.exports.help = {
	name: "slap",
	type: "fun",
	aliases: ['sl'],
	desc: "Reaction Gif: Slaps The Tagged User",
	usage: "!!slap (tagged user)",
	hidden: "true"
}