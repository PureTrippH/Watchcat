exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const fetch = require('node-fetch');
	const embed = new Discord.MessageEmbed();
	const tagged = message.mentions.users.first()

	if(!tagged) return message.author.send("You did not tag a user to slap!");
		const resp = await fetch('https://rra.ram.moe/i/r?type=cuddle')
		const respJson = await resp.json();
		console.log("https://rra.ram.moe" + respJson.path);
		embed.setTitle("AWWWWWW!!");
		embed.setDescription(`${message.author} Decided To Kiss ${tagged}! **I SHIP IT**`);
		embed.setImage("https://rra.ram.moe" + respJson.path);
		embed.setColor('#d192d4');
		message.channel.send(embed);
}

module.exports.help = {
	name: "Kiss",
	type: "fun",
	aliases: ['cud'],
	desc: "Reaction Gif: Kiss the Targetted User",
	usage: "!!cuddle (tagged user)"
}