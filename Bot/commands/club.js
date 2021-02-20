exports.run = async (client, message, args) => {
	const create = require('./clubmod/create');
	const post = require('./clubmod/post');
	const createVC = require('./clubmod/vccreate');
	const infoCard = require('./clubmod/info');
	const joinClub = require('./clubmod/joinclub');
	const disbandClub = require('./clubmod/disband');
	const leaveClub = require('./clubmod/leaveclub');
	const announce = require('./clubmod/announce');
	const forceJoin = require('./clubmod/forcejoin');
	const clubList = require('./clubmod/listClubs');
	const writeClub = require('./clubmod/writeChannel');
	const config = require('./clubmod/config');

	const clubSchema = require("../utils/schemas/club");

	const filter = m => m.author.id === message.author.id;



	
	switch(args[0].toLowerCase()) {
		
		case "create":
			create.create(client, message);
		break;

		case "write":
			writeClub.write(client, message, filter);
		break;

		case "list":
			clubList.listClubs(client, message);
		break;

		case 'post':
			post.post(client, message, filter);
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

		case 'forcejoin':
			forceJoin.forceJoin(client, message, filter);
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

		case "announce":
			await announce.announce(client, message);
		break;

		case "leave":
			await leaveClub.leaveClub(client, message);
		break;

		default:
			message.author.send("No Command Found. Try again");

		break;

	}
}

module.exports.help = {
	name: "club",
	type: "utility",
	aliases: [],
	desc: "Club Management Command for All Club Related Commands.",
	usage: "!!gem (user) (Dev Arg)"
}