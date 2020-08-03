const { Mongoose } = require("mongoose");

exports.run = async (client, message, args) => {
	const serverSettings = require("../data/serversettings.json");
	const filter = m => m.author.id === message.author.id;
    const tagged = message.mentions.users.first();
	const time = args[1];
	const channel = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].channel;
	const role = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].role;
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	
	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");

	const thisConfig = serverConfig.findOne({
		guildId: message.guild.id
	}, (err, guildConfig) => {
		if(!guildConfig) {
			console.log("No Data Found!");
			const newConfig = new serverConfig({
				_id: mongoose.Types.ObjectId(),
				guildId: message.guild.id,
				removedRole: "blank",
				verChannel: "blank",
				prefix: "?"
			});

			newConfig.save();
			
			return message.channel.send("Server not Found! Adding Server to our Database");
		}
	});

	let dbRes = await thisConfig.findOne({
		guildId: message.guild.id
	});

	const fs = require("fs");
	if(message.member.hasPermission('ADMINISTRATOR') || message.author.id == '168695206575734784') {
	message.channel.send({embed: {
		color: 0x00ff00,
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: `Laela's Watchdog's Config - React to Emoji to Edit Config`,
		timestamp: new Date(),
		fields: [
			{
				name: '1️⃣ Role:',
				value: dbRes.removedRole,
				
			},
			{
				name: '2️⃣ Channel:',
				value: dbRes.verChannel,
				
			}
		],
		footer: {
		  icon_url: client.user.avatarURL,
		  text: client.user.username
		},
	  }
	}).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		console.log(thisConfig);
	
		msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣'),
	  { max: 1, time: 50000 }).then(collected => {
		  const reaction = collected.first().emoji.name;
		console.log(reaction);
		if(collected.first().emoji.name == '1️⃣') {
			message.channel.send("Please send a Role");
			message.channel.awaitMessages(filter, {
				max: 1
			}).then(collectedtext => {
			let newText = collectedtext.first().content.replace('<@&', '').replace('>', "");
			console.log(newText);
			let newrole = message.guild.roles.cache.get(newText);
			
			if(!newrole) {
				message.channel.send("No Role Found!");
			} else {

				updateVer(thisConfig, "removedRole", newText);
				thisConfig.updateOne({
					removedRole: newText
				});
			}
		});
	}
		if(collected.first().emoji.name == '2️⃣') {
			message.channel.send("Please send a Channel");
			message.channel.awaitMessages(filter, {
				max: 1
			}).then(collectedtext => {
			let newText = collectedtext.first().content.replace('<#', '').replace('>', "");
			console.log(newText);
			if(!message.guild.channels.cache.get(newText)) {
				message.channel.send("No Channel Found!");
			} else {
				updateVer(thisConfig, "verChannel", newText);

				thisConfig.updateOne({
					verChannel: newText
				});
			}
		});
		}
	});
});
	} else {
		message.member.send("No Permissions")
	}
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
	desc: "Opens your Server's Config.",
	usage: "l^config"
}

const updateVer = async(thisConfig, field, val) => {
	await thisConfig.updateOne({
		field: val
	});
}