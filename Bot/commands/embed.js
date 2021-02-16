//Most Likely should Optimize this Spaghetti Code.
exports.run = async (client, message, args) => {
  const Discord = require('discord.js');
  const embedSchem = require('../utils/schemas/embeds');
  const mongoose = require('mongoose');
  const embEd = require('./embedbuilder/editor');
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Edit Embed");
  embed.setDescription("Welcome to the New Embed Builder. Choose An Option Below.");
  embed.addFields({ name: `1️⃣`, value: `Create A New Embed`});
  embed.addFields({ name: `2️⃣`, value: `Edit an Old Embed`});
  embed.addFields({ name: `3️⃣`, value: `Post an Embed`});
  message.channel.send(embed).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('3️⃣');
  msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			console.log(reaction);
			switch(reaction) {
        case '1️⃣':
          message.channel.send("What Do You Want to Name the Embed? (This is what you type to send the embed or edit it)");
          embEd.editor(await collectMsg(message), new Discord.MessageEmbed(), message);
				break;
        case '2️⃣':
          message.channel.send("Enter the Embed ID: (This is what you type to send the embed or edit it)");
          //Im Tired and I need to finish this. Ill combine the variables and repeat code laters.
          let searchedID = await collectMsg(message);
				  let savedEmbed = await embedSchem.findOne({
            guildId: message.guild.id,
            embedId: searchedID.toLowerCase(),
          });
          if(!savedEmbed) return message.channel.send("Embed Does Not Exist. Try again.");
          
          embEd.editor(await collectMsg(message), new Discord.MessageEmbed(savedEmbed.embedInfo), message);
				break;
        case '3️⃣':
          message.channel.send("Enter the Embed ID: (This is what you type to send the embed or edit it)");
          let searchedIDLoad = await collectMsg(message);
				  let loadedEmb = await embedSchem.findOne({
            guildId: message.guild.id,
            embedId: searchedIDLoad.toLowerCase(),
          });
          if(!loadedEmb) return message.channel.send("Embed Does Not Exist. Try again.");
          
          message.channel.send(new Discord.MessageEmbed(loadedEmb.embedInfo));
				break;
      }
      });
  });
}

const collectMsg = async(message) => {
		const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
			max: 1
		})
		return msg.first().content;
}


module.exports.help = {
  name: "Embed",
  type: "utility",
  aliases: [],
	desc: "Opens the Embed Editor to create Discord Embeds",
	usage: "!!embed"
}


