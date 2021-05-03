//Most Likely should Optimize this Spaghetti Code.
exports.editor = async (thisServer, message, client) => {
  const Discord = require('discord.js');
  const serverConf = require('../../utils/schemas/serverconfig');
  const mongoose = require('mongoose');
  const ms = require('ms');
  const config = require('../config');
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Tier Editor");
  embed.setDescription("Blacklist Editor: Please Select An Option.");
  embed.addFields({ name: `1️⃣`, value: `Set Auto Tier`});
  embed.addFields({ name: `2️⃣`, value: `Add Word`});
  embed.addFields({ name: `3️⃣`, value: `Remove Word`});
  embed.addFields({ name: `4️⃣`, value: `Preview Blacklist.`});
  message.channel.send(embed).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('3️⃣');
    msg.react('4️⃣');
    msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			switch(reaction) {
        case '1️⃣':
          message.channel.send(`Please Enter Tier`);
          if(thisServer.serverTiers.findIndex(tier => tier.TierName === tierID) === -1) {
            message.channel.send("Tier Not Found! Try Again");
            return this.editor(thisServer, message, client);
          } 
          let tierName = await collectMsg();
            await serverConf.findOneAndUpdate(
              {
                guildId: message.guild.id, 
              }, 
              {
                  blackListTier: tierName
            }, (err) => {console.log(err)}).exec();
				break;

        case '2️⃣':
          
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
