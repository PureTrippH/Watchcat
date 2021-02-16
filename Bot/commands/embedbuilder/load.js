//Most Likely should Optimize this Spaghetti Code.
exports.run = async (client, message, args) => {
  const Discord = require('discord.js');
  const embed = new Discord.MessageEmbed();

  embed.setTitle("Embed Builder");
  embed.setDescription("Welcome to the New Embed Builder. Choose An Option Below.");
  embed.addFields({ name: `1️⃣`, value: `Create A New Embed`});
  embed.addFields({ name: `2️⃣`, value: `:Load An Embed`});
  embed.addFields({ name: `3️⃣`, value: `Edit an Old Embed`});
}

module.exports.help = {
  name: "Embed",
  type: "utility",
  aliases: [],
	desc: "Opens the Embed Editor to create Discord Embeds",
	usage: "!!embed"
}


