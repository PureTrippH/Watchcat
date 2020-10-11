exports.run = async (client, message, args) => {
    const tagged = message.mentions.users.first();
    const time = args[1];
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const auditlog = require("../data/auditlog.json");
    const fs = require("fs");
    const ms = require("ms");


	if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Did you really try to tempban as a regular. Come on...");
    if(!ms(time)) return message.channel.send("No Time was Specified");
	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tempban");
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
            message.channel.createInvite({
				maxAge: 86400,
				maxUses: 1
			}).then(function(newInvite){
				let inviteStr = ("https://discord.gg/" + newInvite.code)
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
						
                    },
                    {
						name: 'Time:',
						value: time,
						
                    },
                    {
						name: 'Invite:',
						value: inviteStr,
						
					},
				],
				footer: {
				  icon_url: client.user.avatarURL,
				  text: client.user.username
				},
              }
            }).then(async msg => {
				let currentpun = {reason: reason, type:`Tempban - ${time}`, user: message.mentions.members.first().id, time: time};
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
				

				
                await message.mentions.members.first().ban(reason)
                setTimeout(() => {
                    try {
                    message.guild.members.unban(message.mentions.members.first().id, {reason: "They have served their sentence"});
                    } catch(err) {console.log(err);}
                }, ms(time));

			});
			});
		}
	if(collected.first().emoji.name == '❌') {
		message.channel.send(`Tempban Canceled. Well I guess ${tagged} is VERY lucky...`);
	}
					
}).catch((err) => {
	console.log(err);
	message.channel.send(`Tempban Cancelled. You Were Timed Out`);
});
	  });
}


const punishaudit = (reason, type, user, time) => {
	this.user = user;
	this.type = type;
    this.reason = reason;
    this.time = time;
};

module.exports.help = {
	name: "Tempban",
	type: "moderation",
	aliases: [],
	desc: "Do I really have to explain... ._.",
	usage: "l^tempban (user) (time) [reason]"
}