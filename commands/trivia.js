exports.run = async (client, message, args) => {
    const fetch = require("node-fetch");

    const triviaQuestion = JSON.parse(await fetch(`hhttps://jservice.io/api/random`));
    console.log(triviaQuestion);

    

}


module.exports.help = {
	name: "Skyblock",
	desc: "View a Minecraft Players Hypixel Skyblock Statistics",
	usage: "l^Skyblock (MC Username), (Profile #)"
}