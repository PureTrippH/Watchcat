exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const fetch = require('node-fetch');
	const embed = new Discord.MessageEmbed();
	const Stats = require('../utils/schemas/serverstat');

	let req = await Stats.findOne({
		guildId: message.guild.id
	})
	if(message.author.id == '168695206575734784') {
	console.log(req);
	req.guildMembers.forEach(async user => {
		await Stats.updateOne(
			{
			  guildId: message.guild.id, 
			  "guildMembers.userID": user.userID
			}, 
			{
			  "guildMembers.$.eggCount": 0
			}).exec().then((err) => {
				console.log(`${err}: Set User to 0`);
			});
		})
	}
}

module.exports.help = {
	name: "slap",
	type: "fun",
	aliases: ['resetegg'],
	desc: "Reaction Gif: Slaps The Tagged User",
	usage: "!!slap (tagged user)",
	hidden: "true"
}