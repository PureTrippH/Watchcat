exports.run = async (client, message, args) => {
	const fs = require("fs");
	const Discord = require('discord.js');
	const Embed = new Discord.MessageEmbed();
	const msgAdder = require("../commands/devcmd/addMsges.js");
	const premAdder = require("../commands/devcmd/addprem.js");
	const premMedal = require("../commands/devcmd/premMedal.js");
	
	const tagged = message.mentions.members.first();
	
	if(message.author.id == '168695206575734784') {
	if(!tagged) return message.author.send("No User Was Mentioned Dev Options");
	switch(args[0].toLowerCase()) {
		case "msg":
			msgAdder.addmsg(client, message, args, tagged);

		break;

		case "addprem":
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
	desc: "DEV ONLY: Allows Gem#2003 To Access the Dev Panel",
	usage: "!!gem (user) (Dev Arg)"
}