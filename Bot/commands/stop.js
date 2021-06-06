exports.run = async (client, message, args) => {
	const playQueue = require('./play');
	const ytdl = require('ytdl-core');
	const currentQueue = playQueue.getQueue();
	const vc = message.member.voice.channel;
	console.log(currentQueue);
		message.channel.send("Now Stopping Queue...");
		currentQueue.get(message.guild.id).voice_channel.leave().then(() => {
			currentQueue.get(message.guild.id).delete(message.guild.id)
		});
		if(!vc) return message.author.send("Not in a VC");
}

module.exports.help = {
	name: "Stop Music",
	type: "fun",
	aliases: ["s"],
	desc: "Stops the current queue in the VC. When you run this command, you delete the WHOLE Queue.",
	usage: "!!role (user) (add/remove) (role)",
	gif: "https://cdn.discordapp.com/attachments/820346508263424000/820348129227833344/2021-03-13_12-24-10.gif"
}