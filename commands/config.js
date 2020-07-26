exports.run = async (client, message, args) => {
	const serverSettings = require("../data/serversettings.json");
	const filter = m => m.author.id === message.author.id;
    const tagged = message.mentions.users.first();
	const time = args[1];
	const channel = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].channel;
	const role = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].role;
	const reason = args.slice(2).join(" ") || "Unknown Reason";
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
				value: ifNull(role),
				
			},
			{
				name: '2️⃣ Channel:',
				value: ifNull(channel),
				
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

				if(!serverSettings[message.guild.id]) {
					serverSettings[message.guild.id] = {
						role: newText,
					};
				} else {
					{
						serverSettings[message.guild.id].role = newText;

					}
				}
				
				fs.writeFile('./data/serversettings.json', JSON.stringify(serverSettings, null, 4), err => {
					if (err) throw err;
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

				if(!serverSettings[message.guild.id]) {
					serverSettings[message.guild.id] = {
						channel: newText,
					};
				} else {
					{
						serverSettings[message.guild.id].channel = newText;

					}
				}
				
				fs.writeFile('./data/serversettings.json', JSON.stringify(serverSettings, null, 4), err => {
					if (err) throw err;
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