exports.run = async (client, message, args) => {
	const remove = require("../commands/channelcmd/remove.js");
	
	if(message.member.hasPermission('MANAGE_CHANNELS') || message.author.id == '168695206575734784') {
	switch(args[0].toLowerCase()) {
		case "remove":
			remove.removeChannel(client, message, args);
		break;

		default:
			message.author.send("No Command Found. Try again");

		break;
	}
}
}
module.exports.help = {
	name: "Role",
	type: "utility",
	aliases: [],
	desc: "Add or Remove a role from a user",
	usage: "!!role (user) (add/remove) (role)"
}