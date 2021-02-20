exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const fetch = require('node-fetch');
	const embed = new Discord.MessageEmbed();

		const resp = await fetch('https://rra.ram.moe/i/r?type=lewd')
		const respJson = await resp.json();
		console.log("https://rra.ram.moe" + respJson.path);
		embed.setTitle("HOW CUTE!!");
		embed.setDescription(`HOW LEWD ${message.author}`);
		embed.setImage("https://rra.ram.moe" + respJson.path);
		embed.setColor('#d192d4');
		message.channel.send(embed);
}

module.exports.help = {
	name: "lewd",
	type: "fun",
	aliases: ['lewd'],
	desc: "Reaction Gif: lewd... LOOK ITS NOT WHAT YOU THINK",
	usage: "!!lewd (tagged user)",
	gif: "https://cdn.discordapp.com/attachments/812825316564926534/812825707158831150/2021-02-20_18-18-10.gif"
}