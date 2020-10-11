exports.run = (client, message, args) => {
	const tagged = message.mentions.users.first();
	const reason = args.slice(1).join(" ") || "Unknown Reason";
	const auditlog = require("../data/auditlog.json");
	const fs = require("fs");


	if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Did you really try to ban as a regular. Come on...");

	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the kick");
	else return message.channel.send({embed: {
		color: 0xff0000,
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: `Ban: ${tagged ? tagged.username : null}`,
		timestamp: new Date(),
		fields: [
			{
				name: 'Reason:',
				value: reason,
				
			},
			{
				name: 'Confirm?',
				value: "React with :white_check_mark: to confirm",
				
			}
		],
		footer: {
		  icon_url: client.user.avatarURL,
		  text: client.user.username
		},
	  }
	}).then(msg => {
		msg.react('✅');
		msg.react('❌');
		
		msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
	  { max: 1, time: 5000 }).then(collected => {
		  const reaction = collected.first().emoji.name;
		console.log(reaction);
		if(collected.first().emoji.name == '✅') {
			tagged.send({embed: {
				color: 0xff0000,
				author: {
				  name: client.user.username,
				  icon_url: client.user.avatarURL
				},
				title: `You Have Been Banned!`,
				timestamp: new Date(),
				fields: [
					{
						name: 'Reason:',
						value: reason,
						
					}
				],
				footer: {
				  icon_url: client.user.avatarURL,
				  text: client.user.username
				},
			  }
			}).then(msg => {
				let currentpun = {reason: reason, type:"Ban", user: message.mentions.members.first().id};
				let subarray = [currentpun];
				if(auditlog[message.mentions.members.first().id]) {
					let punisharray = auditlog[message.mentions.members.first().id].punishments
					punisharray.push(currentpun);
					auditlog[message.mentions.members.first().id] = {
						punishments: punisharray,
					};
					fs.writeFile('./data/auditlog.json', JSON.stringify(auditlog, null, 4), err => {
						if (err) throw err;
							});
				} else {
					auditlog[message.mentions.members.first().id] = {
						punishments: [currentpun],
					};
					fs.writeFile('./data/auditlog.json', JSON.stringify(auditlog, null, 4), err => {
						if (err) throw err;
							});
				}
				

				
				message.mentions.members.first().ban(reason);	
			});
		}
	if(collected.first().emoji.name == '❌') {
		message.channel.send(`Ban Canceled. Well I guess ${tagged} is VERY lucky...`);
	}
					
}).catch((err) => {
	console.log(err);
	message.channel.send(`Ban Cancelled. You Were Timed Out`);
});
	  });
}


const punishaudit = (reason, type, user) => {
	this.user = user;
	this.type = type;
	this.reason = reason;
};

module.exports.help = {
	name: "Ban",
	aliases: [],
	type: "moderation",
	desc: "Do I really have to explain... ._.",
	usage: "l^ban (user)"
}