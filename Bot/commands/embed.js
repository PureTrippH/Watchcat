//Most Likely should Optimize this Spaghetti Code.
exports.run = async (client, message, args) => {
  const Discord = require('discord.js');
  const embedSchem = require('../utils/schemas/embeds');
  const mongoose = require('mongoose');
  const embEd = require('./embedbuilder/editor');
  const embed = new Discord.MessageEmbed();
  if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.author.send("You Cant Use Embeds");
  embed.setTitle("Edit Embed");
  embed.setDescription("Welcome to the New Embed Builder. Choose An Option Below.");
  embed.addFields({ name: `1️⃣`, value: `Create A New Embed`});
  embed.addFields({ name: `2️⃣`, value: `Edit an Old Embed`});
  embed.addFields({ name: `3️⃣`, value: `Post an Embed`});
  embed.addFields({ name: `4️⃣`, value: `Edit a Posted Embed`});
  message.channel.send(embed).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('3️⃣');
    msg.react('4️⃣');
    
  msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			console.log(reaction);
			switch(reaction) {
        case '1️⃣':
          message.channel.send("What Do You Want to Name the Embed? (This is what you type to send the embed or edit it)");
          embEd.editor(await collectMsg(message), new Discord.MessageEmbed(), message);
				break;
        case '2️⃣':
          let savedEmbed = await collectID(message, embedSchem);
          if(!savedEmbed) return message.channel.send("Embed Does Not Exist. Try again.");
          
          embEd.editor(await collectMsg(message), new Discord.MessageEmbed(savedEmbed.embedInfo), message);
				break;
        case '3️⃣':
          let loadedEmb = await collectID(message, embedSchem);
          if(!loadedEmb) return message.channel.send("Embed Does Not Exist. Try again.");
          
          message.channel.send(new Discord.MessageEmbed(loadedEmb.embedInfo));
				break;

        case '4️⃣':
          message.channel.send("Please Send The Channel.");
          let channel = message.guild.channels.cache.get(await collectMsg(message));
          message.channel.send("Please send the Message ID");
          channel.messages.fetch(await collectMsg(message)).then(async msg => {
            msg.edit(new Discord.MessageEmbed((await collectID(message, embedSchem)).embedInfo));
          });
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

const collectID = async(message, embedSchem) => {
  message.channel.send("Enter the Embed ID: (This is what you type to send the embed or edit it)");
    let searchedIDLoad = await collectMsg(message);
    let loadedEmb = await embedSchem.findOne({
      guildId: message.guild.id,
      embedId: searchedIDLoad.toLowerCase(),
    });
  return loadedEmb;
      
}


module.exports.help = {
  name: "Embed",
  type: "utility",
  aliases: ["emb"],
	desc: "Opens the Embed Editor to create Discord Embeds. Here, you can reuse embeds by editing previously posted ones and post them. This is one of the most powerful features of watchcat, and is straight forward.",
	usage: "!!embed",
  gif: "https://cdn.discordapp.com/attachments/817804441130369066/817898679641833492/2021-03-06_11-50-16_1.gif"
}


