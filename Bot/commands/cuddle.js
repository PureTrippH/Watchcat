exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const fetch = require('node-fetch');
	const embed = new Discord.MessageEmbed();
	const tagged = message.mentions.users.first()

	if(!tagged) return message.author.send("You did not tag a user to slap!");
		const resp = await fetch('https://rra.ram.moe/i/r?type=cuddle')
		const respJson = await resp.json();
		console.log("https://rra.ram.moe" + respJson.path);
		embed.setTitle("HOW CUTE!!");
		embed.setDescription(`${message.author} Needed Some Virtual Cuddles So ${tagged} was the target >:)`);
		embed.setImage("https://rra.ram.moe" + respJson.path);
		embed.setColor('#d192d4');
		message.channel.send(embed);
}

module.exports.help = {
	name: "cuddle",
	type: "fun",
	aliases: ['cud'],
	desc: "Reaction Gif: Cuddle With the Targetted User",
	usage: "!!cuddle (tagged user)"
}