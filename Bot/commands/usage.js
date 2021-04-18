exports.run = async (client, message, args) => {


	if((message.author.id == '476551304852799489' || message.author.id == '168695206575734784') && (args[0] == "@everyone" || args[0] == "everyone")) {
		message.channel.send(`Could not find the command @everyone`);
	}
}

module.exports.help = {
	name: "4/11",
	aliases: ["4/11"],
	type: "fun",
	desc: "A Joke Command only Gem can do to ping @everyone (only works on Los Lechugas).",
	usage: "!!usage @everyone.... WAIT A SECOND PING PING PING"
}