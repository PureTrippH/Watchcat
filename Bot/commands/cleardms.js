exports.run = async(client, message, args) => {
	const user = message.author;
	user.createDM().then(async channel => {
		let messages = await channel.messages.fetch({ limit: 99});
		const msgs = messages.filter(m => m.author.id === "735559543886446712");
		msgs.forEach(msg => {
			msg.delete();
		})
		message.channel.send("DMs Deleted!");
	});
}

module.exports.help = {
	name: "Clear DMs",
	type: "event",
	aliases: ['buzzer'],
	desc: "Has !!hentai or !!roulette gotten a little too weird? Well, this is the place to clear your DMs of the internet's trash.",
	usage: "!!cleardms",
	gif: "https://cdn.discordapp.com/attachments/812833327148826654/812834032089563216/2021-02-20_18-51-21.gif"
}