exports.run = async (client, message, args) => {
	const add = require("../commands/rolecmd/add.js");
	const remove = require("../commands/rolecmd/remove.js");
	
	if(message.member.hasPermission('MANAGE_CHANNELS') || message.author.id == '168695206575734784') {
	let role = (message.guild.roles.cache.get(args[1])) ? (message.guild.roles.cache.get(args[1])) : message.guild.roles.cache.find(role => role.name.toLowerCase() === args[1].toLowerCase());
	if(!role) return message.channel.send("No Role Was Found!");
	switch(args[0].toLowerCase()) {
		case "color":
			role.setColor(args[2]);
		break;

		case "name":
			console.log(args.slice(2).join(" "));
			role.setName(args.slice(2).join(" "));

		break;

		default:
			message.author.send("No Command Found. Try again");

		break;

	}
}
}
module.exports.help = {
	name: "Role Edit",
	aliases: [],
	type: "utility",
	desc: "Add or Remove a role from a user",
	usage: "!!role (user) (add/remove) (role)"
}