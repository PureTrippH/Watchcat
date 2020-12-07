exports.run = async (client, message, args) => {
	const Discord = require('discord.js');
	const mongoose = require('mongoose');
	const createVC = require('./clubmod/vccreate');
	const infoCard = require('./clubmod/info');
	const joinClub = require('./clubmod/joinclub');
	const disbandClub = require('./clubmod/disband');
	const leaveClub = require('./clubmod/leaveclub');

	const clubSchema = require("../utils/schemas/club");

	const filter = m => m.author.id === message.author.id;



	
	switch(args[0].toLowerCase()) {
		
		case "create":
			message.channel.send("Please Insert A Club Name And A Club Thumbnail (In Separate Messages Please):");

			message.channel.awaitMessages(filter, {max:2}).then(async collected => {

				const clubInfo = {
					title: collected.first().content,
					thumbnail: collected.last().content,
				};
				let embed = new Discord.MessageEmbed();
				embed.setTitle(`Confirm ${clubInfo.title}?`);
				embed.setThumbnail(clubInfo.thumbnail);
				message.channel.send(embed).then(msg => {
				msg.react('✅');
				msg.react('❌');
				msg.awaitReactions((reaction, user) => user.id == message.author && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
					{ max: 1, time: 50000 }).then(collected => {
					console.log(collected.first().emoji.name);
					if(collected.first().emoji.name == '✅') {
						message.author.send("Club For Server Created!");
						const newClub = new clubSchema({
							_id: mongoose.Types.ObjectId(),
							guildId: message.guild.id,
							clubName: (clubInfo.title).toLowerCase(),
							channelCount: 0,
							thumbnail: clubInfo.thumbnail,
							leader: message.author.id,
							members: [message.author.id]
						});
						newClub.save();
					}
					});
				});

				});
		break;

		case "channel":
			createVC.runClub(client, message);
		break;
			
		case "info":
			message.channel.send("Please Enter The Club Name:");
			message.channel.awaitMessages(filter, {max:1}).then(collected => {
				infoCard.runEmbed(client, message, (collected.first().content).toLowerCase());
			});
		

		break;

		case "join":
			await joinClub.joinClub(client, message, filter, clubSchema);
		break;

		case "disband":
			await disbandClub.disband(client, message);
		break;

		case "leave":
			await leaveClub(client, message);
		break;

		default:
			message.author.send("No Command Found. Try again");

		break;

	}
}

module.exports.help = {
	name: "club",
	type: "fun",
	aliases: [],
	desc: "DEV ONLY: Allows Gem#2003 To Access the Dev Panel",
	usage: "!!gem (user) (Dev Arg)"
}