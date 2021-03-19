const isMessageCooldown = new Set();
const prefixes = new Map();
module.exports = async (client, message) => {
    const mongoose = require('mongoose');
    const serverStats = require("../utils/schemas/serverstat.js");
    const queries = require('../utils/queries/queries.js');
    if(message.author.bot) return;



if(message.guild) {


//Is the User in the Cooldown for message count?
if(!isMessageCooldown.has(message.author.id)) {
const [ user, dbResConfig] = await Promise.all([queries.queryUser(message.guild.id, message.author.id), queries.queryServerConfig(message.guild.id)]);
if(dbResConfig.prefix != prefixes.get(message.guild.id)) {
  prefixes.set(message.guild.id, dbResConfig.prefix);
}
addOne(message, client, mongoose, serverStats, dbResConfig);
  if(user.guildMembers[0].messageCount >= 161 && dbResConfig && message.member.roles.cache.has(dbResConfig.newUserRole)) {
    message.member.roles.remove(dbResConfig.newUserRole);
  }

checkTiers(message, client, mongoose, serverStats, dbResConfig, user);


  
isMessageCooldown.add(message.author.id);
setTimeout(() => {
  isMessageCooldown.delete(message.author.id);
}, 5000);

}


    }
    //Starts to Splice the Message, checking and removing command and prefix
    if(!prefixes.get(message.guild.id)) {
      let guildData = await queries.queryServerConfig(message.guild.id);
      if(guildData.prefix) {
        prefix.set(message.guild.id, guildData.prefix);
      } else {
        prefix.set(message.guild.id, "!!");
      }
    }
    prefix = prefixes.get(message.guild.id);
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g); 
    const command = args.shift().toLowerCase();
    //Get command from the ../commands file
    let cmd = client.commands.get(command);
    if(!cmd) {
      cmd = client.aliases.get(command);
    } 

    if (!cmd) return;
    cmd.run(client, message, args);
  };

 const addOne = (message, client, mongoose, serverStats,) => {
        serverStats.updateOne(
          {
            guildId: message.guild.id, 
            "guildMembers.userID": message.author.id
          }, 
          {
          $inc:{
            "guildMembers.$.messageCount":1
          }}).exec();
  }

  const checkTiers = async(message, client, mongoose, serverStats, dbResConfig, user) => {
(user.guildMembers[0].punishmentsTiers).forEach(tier =>{
  if((parseInt(tier.TierForgiveness) + parseInt(tier.OffenderMsgCount)) <= parseInt(user.guildMembers[0].messageCount)) {
    console.log(tier.tierName);
    serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": message.author.id} , {
      $pull: {
        "guildMembers.$.punishmentsTiers": {
        tierName: tier.tierName,
        }
      }}, {multi: true}).limit(1).lean().exec();

      if(dbResConfig.logChannel != "blank") {
        let logChannel = client.channels.cache.get(dbResConfig.logChannel);

        logChannel.send({embed: {
          color: 0x95eb34,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          description: `Tier Forgiven: ${message.guild.member(message.author) ? message.guild.member(message.author).displayName : null}`,
          title: `User: ${message.guild.member(message.author) ? message.guild.member(message.author).displayName : null}`,
          timestamp: new Date(),
          fields: [
            {
              name: 'Reason of Original Tier:',
              value: tier.tierName,
              
            }
          ],
          footer: {
            icon_url: client.user.avatarURL,
            text: client.user.username
          },
          }
        })
      }

  }
});
  }