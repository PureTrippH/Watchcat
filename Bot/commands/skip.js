exports.run = async (client, message, args) => {
	const playQueue = require('./play');
	const ytdl = require('ytdl-core');
	const currentQueue = await playQueue.getQueue();
	console.log(currentQueue);

	if(message.member.hasPermission("MANAGE_MESSAGES")) {
		message.channel.send("Now Skipping Song...");
		currentQueue.get(message.guild.id).connection.dispatcher.end();
	}
}

module.exports.help = {
	name: "Skip Music",
	type: "fun",
	aliases: ["s"],
	desc: "Skip music in the current VC. If none is playing, it will send you a message.",
	usage: "!!role (user) (add/remove) (role)",
	gif: "https://cdn.discordapp.com/attachments/820346508263424000/820348129227833344/2021-03-13_12-24-10.gif"
}