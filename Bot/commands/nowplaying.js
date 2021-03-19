exports.run = async (client, message, args) => {
	const status = message.member.user.presence.activities.find(statuses => statuses.type == "LISTENING");
	const Discord = require("discord.js");
	const embed = new Discord.MessageEmbed();
	console.log(message.member.user.presence.activities);
	if(client.presence.activities.length === 0 || status == undefined) return message.author.send("Not listening on Spotify");
	if(status.type == "LISTENING") {
		embed.setTitle(`${status.details} - ${status.state}`);
		embed.setColor('#1DB954');
		console.log(status.assets.largeImage.slice(8));
		if(status.assets) {
			embed.setThumbnail(`http://i.scdn.co/image/${status.assets.largeImage.slice(8)}`);
		}
		
		embed.setDescription(`Listen to it at: http://open.spotify.com/track/${status.syncID}`);
		embed.addFields({ name: `Album -`, value: `**${status.assets.largeText}**`});
		message.channel.send(embed);
	}
}
module.exports.help = {
	name: "Now Playing",
	type: "fun",
	aliases: ['np'],
	desc: "Displays What You Are Currently Playing on Spotify. (NOTE: Spotify must be linked to Discord)",
	usage: "!!np",
	gif: "https://cdn.discordapp.com/attachments/754785638766608586/820443916389318676/2021-03-13_18-48-35_1.gif"
}