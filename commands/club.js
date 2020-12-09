exports.run = async (client, message, args) => {
	const create = require('./clubmod/create');
	const createVC = require('./clubmod/vccreate');
	const infoCard = require('./clubmod/info');
	const joinClub = require('./clubmod/joinclub');
	const disbandClub = require('./clubmod/disband');
	const leaveClub = require('./clubmod/leaveclub');
	const config = require('./clubmod/config');

	const clubSchema = require("../utils/schemas/club");

	const filter = m => m.author.id === message.author.id;



	
	switch(args[0].toLowerCase()) {
		
		case "create":
			create.create(client, message);
		break;

		case "channel":
			createVC.runClub(client, message);
		break;
			
		case "info":
			message.channel.send("Please Enter The Club Name:");
			message.channel.awaitMessages(filter, {max:1}).then(collected => {
				infoCard.runEmbed(client, message, (collected.first().content).toLowerCase());
			});
		

		break;

		case "join":
			await joinClub.joinClub(client, message, filter, clubSchema);
		break;

		case "config":
			await config.config(client, message, filter, clubSchema);
		break;


		case "disband":
			await disbandClub.disband(client, message);
		break;

		case "leave":
			await leaveClub(client, message);
		break;

		default:
			message.author.send("No Command Found. Try again");

		break;

	}
}

module.exports.help = {
	name: "club",
	type: "fun",
	aliases: [],
	desc: "DEV ONLY: Allows Gem#2003 To Access the Dev Panel",
	usage: "!!gem (user) (Dev Arg)"
}