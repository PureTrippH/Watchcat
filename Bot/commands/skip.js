exports.run = async (client, message, args) => {
	const playQueue = require('./play');
	const ytdl = require('ytdl-core');
	const currentQueue = await playQueue.getQueue();
	const pollSchema = require('../utils/schemas/poll');
	const Discord = require('discord.js');
	const mongoose = require('mongoose');
	console.log(currentQueue);

	if(currentQueue.get(message.guild.id)) {
		if(message.member.hasPermission("MANAGE_MESSAGES")) {
			currentQueue.get(message.guild.id).connection.dispatcher.end();
		} else if(currentQueue.get(message.guild.id).skipVotes == 0) {
			let poll = new Discord.MessageEmbed();
			poll.setTitle(`Skip Song?: 30 Seconds Remaining`);
			const expires = new Date();
			expires.setSeconds(expires.getSeconds() + 30);
			poll.addFields({ name: `Positive:`, value: `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`, inline: true }, { name: `Negative:`, value: `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`, inline: true });
			const pollmsg = await message.channel.send(poll);
				 pollmsg.react(client.emojis.resolveIdentifier("767083818199810088"));
				 pollmsg.react(client.emojis.resolveIdentifier("767083772440608778"));	 
			let newPoll = new pollSchema({
				_id: mongoose.Types.ObjectId(),
				guildId: message.guild.id,
				endDate: expires,
				channel: pollmsg.channel.id,
				message: pollmsg.id,
				type: 'skippoll'
			});
			newPoll.save();
		}
	}
}

module.exports.help = {
	name: "Skip Music",
	type: "fun",
	aliases: ["s"],
	desc: "Skip music in the current VC. Admins are Able to Instantly skip a song. However, if a regular uses wishes to skip, they must get a majority of the VC to accept in the Skip Poll.",
	usage: "!!role (user) (add/remove) (role)",
	gif: "https://cdn.discordapp.com/attachments/820346508263424000/820348129227833344/2021-03-13_12-24-10.gif"
}