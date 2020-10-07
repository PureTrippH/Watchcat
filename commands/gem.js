exports.run = async (client, message, args) => {
	const fs = require("fs");
	const msgAdder = require("../commands/devcmd/addMsges.js");
	const premAdder = require("../commands/devcmd/addprem.js");
	const tagged = message.mentions.members.first();
	
	if(message.author.id == '168695206575734784') {
	if(!tagged) return message.author.send("No User Was Mentioned Dev Options");
	switch(args[0].toLowerCase()) {
		case "msg":
			msgAdder.addmsg(client, message, args, tagged);

		break;

		case "addprem":
			premAdder.addPremUser(client, message, args, tagged);

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