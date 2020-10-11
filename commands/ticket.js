exports.run = async (client, message, args) => {
	const reason = args.slice(0).join(" ") || "Unknown Reason";
	const fs = require("fs");
	const date = new Date();
	const Discord = require('discord.js');
	const ticket = new Discord.MessageEmbed();
	message.channel.createInvite({
		maxAge: 86400,
		maxUses: 1
	}).then (async function(newInvite){
	ticket.setColor('#cfa9ae');
	ticket.setFooter(`Laela's Watchcat - Created Jul 23 2020`, "https://images.vexels.com/media/users/3/140908/isolated/preview/bdc30bbe3c022a11e2d7fd0e642c61ae-open-book-icon-by-vexels.png");
    ticket.setTimestamp();
    ticket.setTitle(`Ticket: ${message.guild.name}`);
	ticket.setAuthor(`Laela's WatchCat`);
    ticket.setThumbnail('https://images.vexels.com/media/users/3/140908/isolated/preview/bdc30bbe3c022a11e2d7fd0e642c61ae-open-book-icon-by-vexels.png');
    ticket.addFields(
		  { name: `Ticket -`, value: reason, inline: false },
		  { name: `Server Invite -`, value: "https://discord.gg/" + newInvite.code, inline: false },
    );

	
	let guild = client.guilds.cache.get("754785637768626236");
	guild.channels.cache.get("754785739786551358").send(ticket);
});

}; 

module.exports.help = {
	name: "Ticket",
	type: "utility",
	aliases: [],
	desc: "Submits a Ticket to the Developer Server. You can expect a reponse from DMs.",
	usage: "!!ticket (issue)"
}