const { Mongoose } = require("mongoose");

exports.run = async (client, message, args) => {
	const Discord = require('discord.js');
	const queries = require("../utils/queries/queries.js");
	const premUser = require("../utils/schemas/premuser.js");

	const embed = new Discord.MessageEmbed();
	const filter = m => m.author.id === message.author.id;
	const queriedPrem = await queries.queryPremUser(message.guild, message.author.id);


	if(queriedPrem === null) return message.author.send("You Are Not A Premium User of Watchcat. You can sign up by going to the website to get access to cool perks! If you are part of Los Lechugas, This Perk is Free. Just DM Gem#2003 for it.");
	message.channel.send({embed: {
		color: 0x00ff00,
		description: "Thank you for Supporting the Development of Watchcat!",
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: `User Settings - React to Emoji to Edit Settings`,
		timestamp: new Date(),
		fields: [
			{
				name: '1️⃣ Rank Background:',
				value: queriedPrem.background,
				
			},
		],
		footer: {
		  icon_url: client.user.avatarURL,
		  text: client.user.username
		},
	  }
	}).then(msg => {
		msg.react('1️⃣');
	
		msg.awaitReactions((reaction, user) => user.id == message.author.id,
	  { max: 1, time: 50000 }).then(collected => {
		  const reaction = collected.first().emoji.name;
		console.log(reaction);
		if(collected.first().emoji.name == '1️⃣') {
			message.channel.send("Please send a Link To An Image");
			message.channel.awaitMessages(filter, {
				max: 1
			}).then(collectedtext => {
				if((collectedtext.first().content).endsWith(".jpeg") || (collectedtext.first().content).endsWith(".jpg") || (collectedtext.first().content).endsWith(".png") || (collectedtext.first().content).endsWith(".gif")) {
				
				premUser.findOneAndUpdate({
					discordId: message.author.id
				},
				{
					background: collectedtext.first().content
				}).exec();
				message.author.send("Successfully Altered Image");
			} else {
				message.author.send("Image Sent not an immage. Please Send a link to one (Ends in .png or .jpg")
			}
			});
		}
	});
});
};

const ifNull = (val) => {
	if(!val) {
		return "None"
	} else {
		return val
	}
};

module.exports.help = {
	name: "config",
	type: "utility",
	aliases: [],
	desc: "Opens your Server's Config.",
	usage: "l^config"
}

const updateVer = async(queriedPrem, field, val) => {
	await queriedPrem.updateOne({
		field: val
	});

}
