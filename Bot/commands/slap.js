exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const fetch = require('node-fetch');
	const embed = new Discord.MessageEmbed();
	const tagged = message.mentions.users.first()

	if(!tagged) return message.author.send("You did not tag a user to slap!");
		const resp = await fetch('https://rra.ram.moe/i/r?type=slap')
		const respJson = await resp.json();
		console.log("https://rra.ram.moe" + respJson.path);
		embed.setTitle("OW! That Hurt");
		embed.setDescription(`${tagged} was just slapped by ${message.author}`);
		embed.setImage("https://rra.ram.moe" + respJson.path);
		embed.setColor('#d192d4');
		message.channel.send(embed);
}

module.exports.help = {
	name: "slap",
	type: "fun",
	aliases: ['sl'],
	desc: "Reaction Gif: Slaps The Tagged User. Originally created to slap Cindy on Los Lechugas after the removal of Mantaro. Since then, she has inspired me to create other reaction commands on Watchcat",
	usage: "!!slap (tagged user)",
	gif: "https://cdn.discordapp.com/attachments/812821579142266900/812821904222191666/2021-02-20_18-02-49.gif"
}