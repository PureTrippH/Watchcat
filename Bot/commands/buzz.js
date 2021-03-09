const { set } = require("mongoose");

const ansSet = new Set();

exports.run = async(client, message, args) => {
	const tagged = message.mentions.users.first();
	const Discord = require("discord.js");
	const embed = new Discord.MessageEmbed();
	const serverStats = require("../utils/schemas/serverstat.js");
	const fs = require("fs");
	const queries = require('../utils/queries/queries');
	const tInf = await require('./trivmode').getTrivChannels();

	if(tInf.has(message.member.voice.channel.id) && !ansSet.has(message.member.voice.channel.id)) {
	embed.setTitle(`SOMEONE BUZZED IN!`);
	embed.setColor("#357832");
	embed.setThumbnail("https://i.pinimg.com/originals/a3/18/1a/a3181a9427e94a440e7a9f680e7b0604.gif");
	embed.setDescription(`${message.author} buzzed in. You now have **5 Seconds to Answer**.`);
	message.member.voice.setMute(false);
	message.channel.send(embed);
	
	ansSet.add(message.member.voice.channel.id);
	setTimeout(() => {
		ansSet.delete(message.member.voice.channel.id);
		message.author.send("Time is Up.");
		message.member.voice.setMute(true);
	}, 5000);
} else message.channel.send("Channel Not In Trivia Mode or **someone else buzzed in!**");
}

module.exports.help = {
	name: "Trivia Buzzer",
	type: "event",
	aliases: ['buzzer'],
	desc: "Live Trivia Event: Whenever your VC is set to Live Trivia, you can use this command to buzz in. Once you buzz in, you are unmuted for 5 seconds, and no one else can buzz in until you finish. After 5 seconds, you are remuted and cant answer.",
	usage: "!!buzz",
	gif: "https://cdn.discordapp.com/attachments/812833327148826654/812834032089563216/2021-02-20_18-51-21.gif"
}