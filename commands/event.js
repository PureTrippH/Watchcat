const { Mongoose } = require("mongoose");

exports.run = async (client, message, args) => {
  const serverSettings = require("../data/serversettings.json");
  const eggHunt = require("./laelaevents/easteregg.js");
	const filter = m => m.author.id === message.author.id;
    const tagged = message.mentions.users.first();
	const time = args[1];
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const ms = require("ms");
	
	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");
  const fs = require("fs");
  


	if(message.member.hasPermission('ADMINISTRATOR') || message.author.id == '168695206575734784') {
	message.channel.send({embed: {
		color: 0x00ff00,
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: `Laela's Watchdog's Event Panel - React to Start Event`,
		timestamp: new Date(),
		fields: [
			{
				name: '1️⃣ Start Event:',
				value: "React to Start Egg Hunt",
				
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
      eggHunt.run(client, message, args)
      
	}


	});
});
	} else {
		message.member.send("No Permissions")
	}
};

module.exports.help = {
	name: "config",
	desc: "Opens your Server's Config.",
	usage: "l^config"
}
