exports.run = async (client, message, args) => {
    const fs = require("fs");
    const ms = require("ms");
	const queries = require('../utils/queries/queries');


	console.log(await queries.queryUser(message.guild.id, message.author.id));
}

module.exports.help = {
	name: "Query",
	type: "utility",
	desc: "Queries your Information (Meant for testing)",
	usage: "!!query"
};