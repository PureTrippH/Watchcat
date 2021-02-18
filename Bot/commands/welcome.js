//Most Likely should Optimize this Spaghetti Code.
exports.run = async (client, message, args) => {
  const Discord = require('discord.js');
  const serverConf = require('../utils/schemas/serverconfig');
  const mongoose = require('mongoose');
  const embed = new Discord.MessageEmbed();
  const welcomeInfo = {
    joinImg: null,
    leaveImg: null,
    welcomeChannel: null,
    welcomeText: "[=---------------------------------------------------------------------------=]",
  }
    
  embed.setTitle("Edit Welcome Images");
  embed.setDescription("Welcome to the Welcome Image Creator. Please React with the Proper Emoji to Use Me!");
  embed.addFields({ name: `1️⃣`, value: `Set Join Image`});
  embed.addFields({ name: `2️⃣`, value: `Set Leave Image`});
  embed.addFields({ name: `3️⃣`, value: `Set Welcome Channel`});
  embed.addFields({ name: `4️⃣`, value: `Set Welcome Description`});
  embed.addFields({ name: `💾`, value: `Save Progress`});

  if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.author.send("You Cant Use Embeds");
  await reactCreator(embed, welcomeInfo, serverConf, client, message, args);

}

const collectMsg = async(message) => {
		const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
			max: 1
		})
		return msg.first().content;
}

const reactCreator = async(embed, welcomeInfo, serverConf, client, message, args) => {
  message.channel.send(embed).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
    msg.react('3️⃣');
    msg.react('4️⃣');
		msg.react('💾');
  msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			console.log(reaction);
			switch(reaction) {
        case '1️⃣':
          message.channel.send("Please Copy Paste an Image Link For the **JOIN IMAGE**");
          welcomeInfo.joinImg = await collectMsg(message);
          return this.welcomeMaker(embed, welcomeInfo, serverConf, client, message, args);
				break;
        case '2️⃣':
          message.channel.send("Please Copy Paste an Image Link For the **LEAVE IMAGE**");
          welcomeInfo.leaveImg = await collectMsg(message);
          return this.welcomeMaker(embed, welcomeInfo, serverConf, client, message, args);
				break;
        case '3️⃣':
          message.channel.send("Please Copy the **Channel ID** for the Welcome Channel");
          welcomeInfo.welcomeChannel = await collectMsg(message);
          return this.welcomeMaker(embed, welcomeInfo, serverConf, client, message, args);
				break;
        case '4️⃣':
          message.channel.send("Please Enter Welcome Text to display on User Joining");
          welcomeInfo.welcomeText = await collectMsg(message);
          return this.welcomeMaker(embed, welcomeInfo, serverConf, client, message, args);
				break;
        case '💾':
          serverConf.findOneAndUpdate({
            guildId: message.guild.id
          },{
            welcomeInfo
          }).then(err => {
            message.channel.send("Successfully set Welcome Image Info");
          });
        break;

      }
      });
  });
}
exports.welcomeMaker = reactCreator;

module.exports.help = {
  name: "Welcome Editor",
  type: "utility",
  aliases: [],
	desc: "Opens the Welcome Image Builder for Images in your server's Welcome Channel",
	usage: "!!welcome"
}


