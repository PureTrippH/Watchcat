exports.run = async (client, message, args) => {
	const fs = require("fs");
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const serverStats = require("../utils/schemas/serverstat.js");
	const add = require("../commands/rolecmd/add.js");
	const remove = require("../commands/rolecmd/remove.js");
	const tagged = message.mentions.members.first();
	
	if(message.member.hasPermission('MANAGE_CHANNELS') || message.author.id == '168695206575734784') {
	if(!tagged) return message.author.send("No User Was Mentioned for the Role Persist");
	switch(args[1].toLowerCase()) {
		case "add":
			add.rolecmd(client, message, args, tagged);

		break;

		case "remove":
			remove.rolecmd(client, message, args, tagged);

		break;

		default:
			message.author.send("No Command Found. Try again");

		break;

	}
}
}
module.exports.help = {
	name: "Role",
	desc: "Add or Remove a role from a user",
	usage: "!!role (user) (add/remove) (role)"
}