//Most Likely should Optimize this Spaghetti Code.
exports.editor = async (tierID, thisServer, message, client) => {
  const Discord = require('discord.js');
  const serverConf = require('../../utils/schemas/serverconfig');
  const mongoose = require('mongoose');
  const ms = require('ms');
  const config = require('../config');
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Tier Editor");
  embed.setDescription("Welcome to the New Tier Editor. Choose An Option Below.");
  embed.addFields({ name: `1️⃣`, value: `Set Tier Forgiveness`});
  embed.addFields({ name: `2️⃣`, value: `Create Tier Level`});
  embed.addFields({ name: `3️⃣`, value: `Delete Last Tier Level`});
  embed.addFields({ name: `4️⃣`, value: `Preview Tier`});
  embed.addFields({ name: `5️⃣`, value: `Return to Config.`});
  embed.setImage
  message.channel.send(embed).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('3️⃣');
    msg.react('4️⃣');
    msg.react('5️⃣');
    msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			switch(reaction) {
        case '1️⃣':
          message.channel.send(`Please Enter The Tier Forgiveness`);
          message.channel.send(`NOTE: This multiplies by tier. If you choose 10, tier 2 will be 20 and so on`);
          let forgiveness = await collectMsg(message);
            await serverConf.findOneAndUpdate(
              {
                guildId: message.guild.id, 
                "serverTiers.TierName": tierID
              }, 
              {
                  "serverTiers.$.TierForgiveness": forgiveness,
            }, (err) => {console.log(err)}).exec();
            return this.editor(tierID, thisServer, message);
				break;
        case '2️⃣':
          message.channel.send(`Please Enter Punishment for Next Tier Level (warning, mute, ban)`);
          let newPunishment = await collectMsg(message);
          if(newPunishment.toLowerCase() == "warning" || newPunishment.toLowerCase() ==  "ban" || newPunishment.toLowerCase() ==  "mute") {
          message.channel.send(`Please Enter Time For the Next Tier Level (ex: 1d)`);
          let newTime = await collectMsg(message);
          if(!ms(newTime)) return message.channel.send("No Time was Specified");
          await serverConf.findOneAndUpdate({
            guildId: message.guild.id, 
            "serverTiers.TierName": tierID
          }, 
          {
          $push: {
            "serverTiers.$.banOrMute": newPunishment.toLowerCase(),
            "serverTiers.$.TierTimes": ms(newTime)
          }
        }).exec();
        return this.editor(tierID, thisServer, message);
      } else return message.author.send("Punishment Type Not Found!");
				break;
        case '3️⃣':
          await serverConf.findOneAndUpdate(
            {
              guildId: message.guild.id, 
              "serverTiers.TierName": tierID
            }, 
            {
              $pop: {
                "serverTiers.$.TierTimes":  -1,
                "serverTiers.$.banOrMute":  -1
            }
          }, (err) => {console.log(err)}).exec();
          return this.editor(tierID, thisServer, message);
				break;
        case '4️⃣':
          const tierEmb = new Discord.MessageEmbed();
            let resp = await serverConf.findOne(
              {
                guildId: message.guild.id, 
                
              }, {
                serverTiers: {
                  $elemMatch: 
                    {
                      TierName: tierID
                    }
                  }
                });
                tierEmb.setTitle(`Tier Name: ${resp.serverTiers[0].TierName}`);
                tierEmb.setDescription(`Activity Forgiveness: ${resp.serverTiers[0].TierForgiveness}`);
                let x = 0;
                resp.serverTiers[0].banOrMute.forEach(type => {
                  tierEmb.addFields({ name: `Level ${x+1}: ${type}`, value: `Time: ${ms(resp.serverTiers[0].TierTimes[x])}`});
                  x++;
                })
                message.channel.send(tierEmb);
                return this.editor(tierID, thisServer, message);
        break;
        case '5️⃣':
          config.run(client, message);
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
