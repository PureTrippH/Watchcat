const { Mongoose } = require("mongoose");

exports.run = async (client, message, args) => {
	const serverSettings = require("../data/serversettings.json");
	const filter = m => m.author.id === message.author.id;
    const tagged = message.mentions.users.first();
	const time = args[1];
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const ms = require("ms");
	
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
				newUserRole: "blank",
				mutedRole: "blank",
				logChannel: "blank",
				unverifiedRole: "blank",
				serverTiers: []
			});

			newConfig.save();
			
			return message.channel.send("Server not Found! Adding Server to our Database");
		}
	},{upsert:true});

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
				
			},
			{
				name: '3️⃣ New User Role:',
				value: dbRes.newUserRole,
				
			},
			{
				name: '4️⃣ Create Tier:',
				value: "Click 4 to Add Tier",
				
			},
			{
				name: '5️⃣ Edit Tier:',
				value: "Click 5 to Edit Tier",
				
			},
			{
				name: '6️⃣ Mute Role:',
				value: dbRes.mutedRole,
				
			},
			{
				name: '7️⃣ Restricted Role:',
				value: dbRes.mutedRole,
				
			},
			{
				name: '📜 Log Channel:',
				value: dbRes.logChannel,
				
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
		msg.react('3️⃣');
		msg.react('4️⃣');
		msg.react('5️⃣');
		msg.react('6️⃣');
		msg.react('7️⃣');
		msg.react('📜');
	
		msg.awaitReactions((reaction, user) => user.id == message.author.id,
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

		if(collected.first().emoji.name == '3️⃣') {
			message.channel.send("Please send a Role for New Users");
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
					newUserRole: newText
				});
			}
		});
		}

		if(collected.first().emoji.name == '4️⃣') {
			message.channel.send("Tier Maker: Enter in the Name of Your Tier (NOTE! The Mod Will Type this Broad Name to activate its tiers. ALSO NO SPACES!");
			message.channel.awaitMessages(filter, {
				max: 1
			}).then(tierName => {
				message.channel.send(`${tierName.first().content}: Enter in the T1 Punishment time (Example: 1s = 1 second)`);
				message.channel.awaitMessages(filter, {
					max: 1
				}).then(time => {
					if(!ms(time.first().content)) return message.channel.send("No Time was Specified");
					message.channel.send(`${tierName.first().content}: Enter in the T1 Punishment Forgiveness message count. (Example: User loses a tier after sending 1000 msges)`);
					message.channel.awaitMessages(filter, {
						max: 1
					}).then(forgiveness => {	
						message.channel.send(`${tierName.first().content}: Send Your Punishment type.`);
				message.channel.awaitMessages(filter, {
					max: 1
				}).then(punishType => {
					console.log((punishType.first().content.toLowerCase() != "warning" || punishType.first().content.toLowerCase() !=  "ban" || punishType.first().content.toLowerCase() !=  "mute"));
						if(punishType.first().content.toLowerCase() == "warning" || punishType.first().content.toLowerCase() ==  "ban" || punishType.first().content.toLowerCase() ==  "mute") {
							thisConfig.findOneAndUpdate(
								{
								  guildId: message.guild.id
								  }, 
									{
									  $addToSet: {
										serverTiers: {
										  TierName: tierName.first().content.toLowerCase(),
										  TierForgiveness: forgiveness.first().content,
										  TierTimes: [ms(time.first().content)],
										  banOrMute: [punishType.first().content.toLowerCase()]
										}
									  }
								  }).exec()
								  message.channel.send("Successfully created tier");
						
						} else return message.channel.send("Punishment does not exist. Try using Mute, Warning, or Ban");
					});

				});
						
				});
			});
		}

		if(collected.first().emoji.name == '5️⃣') {
			message.channel.send("Tier Editor: Enter the Key Name of the Tier (Ex: IrrImg)");
			message.channel.awaitMessages(filter, {
				max: 1
			}).then(tierID => {
				console.log(dbRes);
				if(dbRes.serverTiers.findIndex(tier => tier.TierName === tierID.first().content.toLowerCase()) === -1) return message.channel.send("Tier Not Found! Try Again");
				const tier = dbRes.serverTiers[dbRes.serverTiers.findIndex(tier => tier.TierName === tierID.first().content)];
				console.log(tier);
				message.channel.send(`${tier.TierName}: Please Enter the Next Tier Time You Want to Add (T${dbRes.serverTiers.findIndex(tier => tier.TierName === tierID.first().content) - 1}) (Enter Delete to Delete Last Tier)`)
				message.channel.awaitMessages(filter, {
					max: 1
				}).then(tierNew => {
						
						if(tierNew.first().content.toLowerCase() == 'delete') {
							thisConfig.updateOne(
								{
									guildId: message.guild.id, 
									"serverTiers.TierName": tierID.first().content
								}, 
								{
									$pop: {
										"serverTiers.$.TierTimes":  -1
								}
							}).exec();

							message.channel.send("Latest Tier Removed!");
							return;
						} else {

					if(!ms(tierNew.first().content)) return message.channel.send("No Time was Specified");
					let newEntry = ms(tierNew.first().content)
					message.channel.send(`Send Your Punishment type for next tier.`);
					message.channel.awaitMessages(filter, {
						max: 1
					}).then(punishType => {
						console.log((punishType.first().content.toLowerCase() != "warning" || punishType.first().content.toLowerCase() !=  "ban" || punishType.first().content.toLowerCase() !=  "mute"));
							if(punishType.first().content.toLowerCase() == "warning" || punishType.first().content.toLowerCase() ==  "ban" || punishType.first().content.toLowerCase() ==  "mute") {
								thisConfig.updateOne(
						{
							guildId: message.guild.id, 
							"serverTiers.TierName": tierID.first().content
						}, 
						{
							$push: {
								"serverTiers.$.banOrMute": punishType.first().content.toLowerCase(),
								"serverTiers.$.TierTimes": newEntry
						}
					}).exec();

					message.channel.send("Successfully edited tier");
				} else return message.channel.send("Punishment does not exist. Try using Mute, Warning, or Ban");
				});
				}
				})
			})
		}

		

		if(collected.first().emoji.name == '📜') {
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
					logChannel: newText
				});
			}
		});
		}

		if(collected.first().emoji.name == '6️⃣') {
			message.channel.send("Please send a Role for Muted Users");
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
					mutedRole: newText
				});
			}
		});
		}


		if(collected.first().emoji.name == '7️⃣') {
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
					unverifiedRole: newText
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