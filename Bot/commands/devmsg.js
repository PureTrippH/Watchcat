const { Mongoose } = require("mongoose");

exports.run = async (client, message, args) => {
	const serverSettings = require("../data/serversettings.json");
	const eggHunt = require("./laelaevents/easteregg.js");
	const filter = m => m.author.id === message.author.id;
	const tagged = message.mentions.users.first();
	const time = args[1];
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const ms = require("ms");

	const mongoose = require('mongoose');
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const fs = require("fs");
  


	if( message.author.id == '168695206575734784') {
	
	}
	
};

module.exports.help = {
	name: "config",
	type: "utility",
	aliases: [],
	desc: "Opens your Server's Config.",
	usage: "l^config",
	hidden: "true"
}
