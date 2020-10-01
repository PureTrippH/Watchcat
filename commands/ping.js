exports.run = async (client, message, args) => {
	const Discord = require('discord.js');
	const ping = new Discord.MessageEmbed;
	ping.setColor('#c9cf59');
	ping.setTitle("Bot Stats");
	let pingTime = Date.now() - message.createdTimestamp;
	ping.addFields(
		{ name: `Ping:`, value: `${pingTime}ms`, inline: true },
	  );
	  message.channel.send(ping);
}

module.exports.help = {
	name: "Ping",
	type: "utility",
	desc: "Returns the bot's ping",
	usage: "!!ping"
}