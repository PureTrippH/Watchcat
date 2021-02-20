exports.run = async (client, message, args) => {
	const Discord = require('discord.js');
	const ping = new Discord.MessageEmbed;
	const shard = await client.shard.fetchClientValues('guilds.cache.size')
	ping.setColor('#c9cf59');
	ping.setTitle("Bot Stats/Diagnostics -");
	let pingTime = Date.now() - message.createdTimestamp;
	ping.setThumbnail('https://www.pinclipart.com/picdir/big/19-198911_vector-royalty-free-download-cats-vector-black-cat.png')
	ping.addFields(
		{ name: `Ping:`, value: `${pingTime}ms`, inline: true },
		{ name: `Shards:`, value: `${shard.length} Shard(s)`, inline: true },
	  );
	  message.channel.send(ping);
}

module.exports.help = {
	name: "Ping",
	type: "utility",
	aliases: [],
	desc: "Returns and Embed with all of the Bot's Statistics (obviously stuff such as the ping), but also the shard count of the bot. If you need to error report, run this first to check the bot's speed",
	usage: "!!ping",
	gif: "https://cdn.discordapp.com/attachments/812811887305031720/812812274104402010/2021-02-20_17-22-58.gif"
}