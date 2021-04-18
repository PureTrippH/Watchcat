const trivChannels = new Set();

exports.getTrivChannels = () => {
	return trivChannels
}

exports.run = async(client, message, args) => {
	const Discord = require("discord.js");
	const embed = new Discord.MessageEmbed();
	const tagged = message.mentions.users.first();
	const serverStats = require("../utils/schemas/serverstat.js");
	const fs = require("fs");
	const queries = require('../utils/queries/queries');
	let connection = await message.member.voice.channel.join();

	if(message.member.hasPermission('MANAGE_CHANNELS')) {
	message.delete();
	message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, { SPEAK: null });
	embed.setTitle('VC In Trivia Mode');
	embed.setColor("#4d16b5");
	embed.setThumbnail("https://www.nydailynews.com/resizer/YWlAIFwc66-T4KisccpRCF5XCI8=/1200x0/top/cloudfront-us-east-1.images.arcpublishing.com/tronc/QQDDBTD2CSFCHCEVNSPVBU2MZY.aspx");
	embed.setDescription('VC is Currently in Trivia Mode. Join the VC and type **!!buzzer once you know the answer**. You will then be unmuted to say the answer');
	if(trivChannels.has(message.member.voice.channel.id)) {
		
		message.member.voice.channel.members.forEach(member => {
			member.voice.setMute(false);
		})
		trivChannels.delete(message.member.voice.channel.id);
		message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, { SPEAK: null });
		return;
	} else {
		message.channel.send(embed);
		console.log(message.member.voice.channel.members);
		message.member.voice.channel.members.forEach(member => {
			member.voice.setMute(true);
		})
		trivChannels.add(message.member.voice.channel.id);
		return;
	}
}

}

module.exports.help = {
	name: "Trivia Mode",
	type: "event",
	aliases: ['tm'],
	desc: `Sets VC to Live Trivia Mode. In this mode, everyone in the VC is server muted. Any mod can unmute themselves to be the host of the Live Trivia session. 
	A user can buzz in using !!buzzer and be able to speak for 5 seconds. Once the 5 seconds is over, they are muted again. If you leave the VC, 
	you are unmuted from the server's VCs`,
	usage: "!!trivmode",
	gif: "https://cdn.discordapp.com/attachments/812823074801975297/812824173822476308/2021-02-20_18-10-14_1.gif"
}