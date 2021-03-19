exports.run = async (client, message) => {
	const filter = m => m.author.id === message.author.id;
	//Library Modules
	const ms = require("ms");
	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const tierEditor = require("./devcmd/tiereditor");

	
	//File Paths & Queries
	const query = require('../utils/queries/queries');
	const thisServer = await query.queryServerConfig(message.guild.id);
	const Discord = require('discord.js');

	//Variable Delcaration
	let embed = new Discord.MessageEmbed();

	if(message.member.hasPermission('ADMINISTRATOR') || message.author.id == '168695206575734784') {
		embed.setTitle("Watchcat Config");
		embed.setDescription("React to Emoji to Edit Config");
		embed.setColor("#98ddfc");
		embed.setThumbnail("https://lh3.googleusercontent.com/proxy/R-TqrLJjqTw4Skfirjskk-KZEEft6tsUHe9l1atC8KoIbEIu5XgLNtweALGLe_oRZcB4yJPdnQVhahvJAnLDAjElQmmiNX4");
		embed.setTimestamp(new Date());
		embed.addFields(
			{ name: `1️⃣ Unverifed Role:`, value: `<@&${thisServer.removedRole}> - Gives to All New Members`, inline: false },
			{ name: `2️⃣ Verification Channel:`, value: `<#${thisServer.verChannel}> - Channel to Verify In`, inline: false },
			{ name: `3️⃣ New User Role:`, value: `<@&${thisServer.newUserRole}> - Role Given to All Newly Verified Members. Allow Users to Greet them!`, inline: false },
			{ name: `4️⃣ Create Tier:`, value: `Create A Punishment Tier Which Scales based on Offense Number. For example, if you spam once,
			you can run !!tier (user) spam and it will automatically warn them. Next time they spam, its automatically a mute. Setup options here.`, inline: false },
			{ name: `5️⃣ Edit Tier:`, value: `Click 5 to Edit Tiers and Tier Levels`, inline: false },
			{ name: `6️⃣ Muted Role:`, value: `<@&${thisServer.mutedRole}> - Role Given When a User is Muted with Watchcat`, inline: false },
			{ name: `7️⃣ Prefix:`, value: `${thisServer.prefix} - Prefix Used For Bot Commands in this server.`, inline: false },
			{ name: `📜 Log Channel:`, value: `<#${thisServer.logChannel}> - Set a Channel Where all Tiers are posted`, inline: false },
		  )
		 message.channel.send(embed).then(msg => {
			msg.react('1️⃣');
			msg.react('2️⃣');
			msg.react('3️⃣');
			msg.react('4️⃣');
			msg.react('5️⃣');
			msg.react('6️⃣');
			msg.react('7️⃣');
			msg.react('📜');
		
			msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
				let reaction = collected.first().emoji.name;
				console.log(thisServer);
				switch(reaction) {
					case '1️⃣':
						message.channel.send("Send a Role or role id");
						const role = await collectMsg(message, 1);
						let newrole = await message.guild.roles.cache.get(role.replace('<@&', '').replace('>', ""));
						if(!newrole) {
							message.channel.send("No Role Found!");
						} else {
							await thisServer.updateOne({
								removedRole: newrole.id
							});	
						}
						return this.run(client, message);
					break;
					case '2️⃣':
						message.channel.send("Please send a Channel");
						let newText = (await collectMsg(message, 1))
						if(!message.guild.channels.cache.get(newText.replace('<#', '').replace('>', ""))) {
							message.channel.send("No Channel Found!");
						} else {
			
							await thisServer.updateOne({
								verChannel: newText.replace('<#', '').replace('>', "")
							});
						}
						return this.run(client, message);
					break;
	
					case '3️⃣':
						message.channel.send("Please send a Role for New Users");
						let newTextTwo = await collectMsg(message, 1);
						let newNewRole = message.guild.roles.cache.get(newTextTwo.replace('<@&', '').replace('>', ""));
						if(!newNewRole) {
							message.channel.send("No Role Found!");
						} else {
							await thisServer.updateOne({
								newUserRole: newNewRole.id
							});	
						}
						return this.run(client, message);
					break;
	
					case '4️⃣':
						message.channel.send("Tier Maker: Enter in the Name of Your Tier (NOTE! The Mod Will Type this Broad Name to activate its tiers. ALSO NO SPACES!");
						let tierName = await collectMsg(message, 1);
						message.channel.send(`${tierName}: Enter in the T1 Punishment time (Example: 1s = 1 second)`);
						let tierTime = await collectMsg(message, 1);
						message.channel.send(`${tierName}: Enter in the T1 Punishment Forgiveness message count. (Example: User loses a tier after sending 1000 msges)`);
						let forgiveness = await collectMsg(message, 1);
						message.channel.send(`${tierName}: Send Your Punishment type (Warning, Mute, or Ban).`);
						let punishType = await collectMsg(message, 1);
						if(punishType.toLowerCase() == "warning" || punishType.toLowerCase() ==  "ban" || punishType.toLowerCase() ==  "mute") {
							await thisServer.updateOne(
									{
									$addToSet: {
										serverTiers: {
										TierName: tierName.toLowerCase(),
										TierForgiveness: forgiveness,
										TierTimes: [ms(tierTime)],
										banOrMute: [punishType.toLowerCase()]
										}
									}
								}).exec()
							message.channel.send("Successfully created tier");
						
						} else return message.channel.send("Punishment does not exist. Try using Mute, Warning, or Ban");
						return this.run(client, message);
					break;
	
					case '5️⃣':
						message.channel.send("Tier Editor: Enter the Key Name of the Tier (Ex: IrrImg)");
						let tierID = await collectMsg(message, 1);
						if(thisServer.serverTiers.findIndex(tier => tier.TierName === tierID) === -1) return message.channel.send("Tier Not Found! Try Again");
						await tierEditor.editor(tierID, thisServer, message, client);
					break;
	
					case '📜':
						message.channel.send("Please send a Channel");
						let newLog = await collectMsg(message, 1);
						if(!message.guild.channels.cache.get(newLog.replace('<#', '').replace('>', ""))) {
							message.channel.send("No Channel Found!");
						} else {
			
							await thisServer.updateOne({
								logChannel: newLog.replace('<#', '').replace('>', "")
							});
						}
						return this.run(client, message);
					break;
	
					case '6️⃣':
						message.channel.send("Please send Your Server's Muted Role");
						let mutedRole = await collectMsg(message, 1);
						let newMutedRole = message.guild.roles.cache.get(mutedRole.replace('<@&', '').replace('>', ""));
						if(!newrole) {
							message.channel.send("No Role Found!");
						} else {
						await thisServer.updateOne({
							mutedRole: newMutedRole.id
						});	
						}
						return this.run(client, message);
					break;
	
					case '7️⃣':
						message.channel.send("Please send a prefix");
						let newPrefix = await collectMsg(message, 1);
						await thisServer.updateOne({
							prefix: newPrefix
						});	
						return this.run(client, message);
					break;
	
				}
				});
			 });
		} else {
			message.member.send("No Permissions")
		}
};

module.exports.help = {
	name: "config",
	type: "utility",
	aliases: ["c"],
	desc: `Opens your Server's Config. Here, you can create set the verification channel, verification role, the Restricted Role, and add and edit tier and their levels for your server.`,
	usage: "!!config",
	gif: "https://cdn.discordapp.com/attachments/820346508263424000/820348355883302973/2021-03-13_12-16-03_1.gif"
}

const updateVer = async(thisConfig, field, val) => {
	await thisConfig.updateOne({
		field: val
	});

}


const collectMsg = async(message) => {
		const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
			max: 1
		})
		return msg.first().content;
}