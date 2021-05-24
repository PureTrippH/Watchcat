exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const fetch = require('node-fetch');
	const embed = new Discord.MessageEmbed();
	const queries = require("../utils/queries/queries.js");
	const Stats = require('../utils/schemas/serverstat');
	if(message.author.id != "168695206575734784") return message.author.send("Nope you Arent Gem!");
	let req = await Stats.findOne({
		guildId: message.guild.id
	})
	req.guildMembers.forEach(async user => {
		const newUser = await queries.queryUser(message.guild.id, user.userID);
		let punishArray = newUser.guildMembers[0].punishmentsTiers;

		punishArray.forEach(async tier => {
			console.log(user.userID);
			if(tier.tierName != "misc2" && tier.tierName != "jadepicrew") {
			Stats.updateOne({
				guildId: message.guild.id, 
				"guildMembers.userID": user.userID,
			}, 
			{
				"guildMembers.$.punishmentsTiers.$[punishmentName].OffenderMsgCount": 0,
				},
				{ "arrayFilters": [
					{ "punishmentName.tierName": tier.tierName }
				], multi: true }).exec().then(err => {
					console.log(err);
				})
			}
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