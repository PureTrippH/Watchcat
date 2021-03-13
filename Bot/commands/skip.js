exports.run = async (client, message, args) => {
	const playQueue = require('./play');
	const ytdl = require('ytdl-core');
	const currentQueue = await playQueue.getQueue();
	console.log(currentQueue);

	if(message.member.hasPermission("MANAGE_MESSAGES")) {
		currentQueue.get(message.guild.id).connection.dispatcher.end();
	}
}

module.exports.help = {
	name: "Skip Music",
	type: "fun",
	aliases: [],
	desc: "Skip music in the current VC. If none is playing, it will send you a message.",
	usage: "!!role (user) (add/remove) (role)",
}