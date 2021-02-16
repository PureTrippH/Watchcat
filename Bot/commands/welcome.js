//Most Likely should Optimize this Spaghetti Code.
exports.run = async (client, message, args) => {
  const Discord = require('discord.js');
  const serverConf = require('../utils/schemas/serverconfig');
  const mongoose = require('mongoose');
  const embed = new Discord.MessageEmbed();
  const welcomeInfo = {
    joinImg,
    leaveImg,
    welcomeChannel,
  }

  if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.author.send("You Cant Use Embeds");
  embed.setTitle("Edit Welcome Images");
  embed.setDescription("Welcome to the New Embed Builder. Choose An Option Below.");
  embed.addFields({ name: `1️⃣`, value: `Set Join Image`});
  embed.addFields({ name: `2️⃣`, value: `Set Leave Image`});
  message.channel.send(embed).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('💾');
  msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			console.log(reaction);
			switch(reaction) {
        case '1️⃣':
          message.channel.send("Please Copy Paste an Image Link For the **JOIN IMAGE**");
          welcomeInfo.joinImg = await collectMsg(message);
          return this.run(client, message, args);
				break;
        case '2️⃣':
          message.channel.send("Please Copy Paste an Image Link For the **LEAVE IMAGE**");
          welcomeInfo.leaveImg = await collectMsg(message);
          return this.run(client, message, args);
				break;
        case '3️⃣':
          message.channel.send("Please Copy the **Channel ID** for the Welcome Channel");
          welcomeInfo.welcomeChannel = await collectMsg(message);
          return this.run(client, message, args);
				break;
        case '💾':
          serverConf.findOneAndUpdate({
            guildId: message.guild.id
          },{
            welcomeInfo
          }).then(err => {
            message.channel.send("Successfully set Welcome Image");
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


module.exports.help = {
  name: "Welcome Editor",
  type: "utility",
  aliases: [],
	desc: "Opens the Welcome Image Builder for Images in your server's Welcome Channel",
	usage: "!!welcome"
}


