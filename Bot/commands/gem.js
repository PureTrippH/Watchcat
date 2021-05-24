const { queryUser, queryServerStats } = require("../utils/queries/queries.js");

exports.run = async (client, message, args) => {
	const fs = require("fs");
	const Discord = require('discord.js');
	const Embed = new Discord.MessageEmbed();
	const msgAdder = require("../commands/devcmd/addMsges.js");
	const premAdder = require("../commands/devcmd/addprem.js");
	const premMedal = require("../commands/devcmd/premMedal.js");
	const devMessage = require("../commands/devcmd/devMessage");
	const serverStats = require('../utils/schemas/serverstat');
	const tagged = message.mentions.members.first();
	
	if(message.author.id == '168695206575734784') {
	const user = await queryUser(message.guild.id, args[1]);
	console.log(tagged);
	
	switch(args[0].toLowerCase()) {
		case "msg":
			if(!tagged || !user) return message.author.send("No User Was Mentioned For Dev Options");
			msgAdder.addmsg(client, message, args, tagged);

		break;

		case "index":
			message.author.send(`Index of User: ${await queryServerStats(message.guild.id).then(stats => { stats.guildMembers.findIndex(userObj => userObj.userID === tagged.id)})}`);
			console.log(await queryServerStats(message.guild.id));
		break;

		case 'message':
			devMessage.message(client, message, args);
		break;

		case "addprem":
			if(!tagged || !user) return message.author.send("No User Was Mentioned For Dev Options");
			premAdder.addPremUser(client, message, args, tagged);
			Embed.setTitle("Thanks for Supporting Watchcat!");
			Embed.setColor('#381334');
			Embed.setDescription(`Hello! I am Gem: The creator of this bot. 
			If you are seeing this, you were wonderful enough to support the creation of this bot.
			Any bit of support helps, whether its contributing code on the Github or
			Donating to the Project. Now, you have access to the premium features`);

			Embed.addFields(
				{ name: `Perk 1:`, value: `You Can Fully Customize your !!stats Card With !!userconf`},
			);
			tagged.send(Embed);

		case "addbooster":
			if(!tagged || !user) return message.author.send("No User Was Mentioned For Dev Options");
			premAdder.addPremUser(client, message, args, tagged);
			await serverStats.findOneAndUpdate({
				guildId: message.guild.id, 
				"guildMembers.userID": tagged.id
			  },
			  {
			"guildMembers.$.boosting": true,
				  "guildMembers.$.boosterRole": args[2]
			  },
			   {upsert: true}).exec();
			Embed.setTitle("Thanks for Supporting Los Lechugas!");
			Embed.setColor('#381334');
			Embed.setDescription(`Hello! If you are seeing this, you are a **Server Booster** on Los Lechugas!
			Thank you for Boosting. You can now customize ur Role whenever you want. Also, you will also automatically
			have !!rank customization.`);
			
			Embed.addFields(
				{ name: `Perk 1:`, value: `You Can Fully Customize your !!stats Card With !!userconf`},
				{ name: `Perk 2:`, value: `You Can Change Your Role Color and Name by using !!boost`},
			);
			tagged.send(Embed);

		break;

		case "medal":
			premMedal.addPremUser(client, message, args, tagged);

		break;

		default:
			message.author.send("No Command Found. Try again");

		break;

	}
}
}
module.exports.help = {
	name: "Gem",
	type: "moderation",
	aliases: [],
	desc: "DEV ONLY: Allows Gem#2003 To Access the Dev Panel",
	usage: "!!gem (user) (Dev Arg)",
	hidden: "false"
}