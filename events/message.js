const isMessageCooldown = new Set();
module.exports = async (client, message) => {
    const serverSettings = require("../data/serversettings.json");
    const mongoose = require('mongoose');
    const serverStats = require("../utils/schemas/serverstat.js");
    const serverConfig = require("../utils/schemas/serverconfig.js");
    if(message.author.bot) return;

if(message.guild) {


if(message.author == '700214206808719432'|| message.content.toLowerCase().includes('airline food')) {
  serverStats.findOneAndUpdate({
    guildId: '709865844670201967', 
    "guildMembers.userID": '700214206808719432'
  },
  {
    $inc:{
      "guildMembers.$.AirLine": 1
    }
  },
   {upsert: false}).exec();
}

//Is the User in the Cooldown for message count?
if(isMessageCooldown.has(message.author.id)) {

  console.log(isMessageCooldown);

} else {

  isMessageCooldown.add(message.author.id);
  setTimeout(() => {
    isMessageCooldown.delete(message.author.id);
  }, 3000)


const dbResStats = await serverStats.findOne({
  guildId: message.guild.id
}, (err, guildStats) => {
  if(!guildStats) {
    console.log("No Data Found!");
    //Creates a New Stats Schema
    const newStats = new serverStats({
      _id: mongoose.Types.ObjectId(),
      guildId: message.guild.id,
      messageCountTotal: 0,
      guildMembersInt: client.guilds.cache.get(message.guild.id).memberCount,
      guildMembers: []
    });
    newStats.save();
  }
});




const user = await serverStats.findOne(
  {
    guildId: message.guild.id,
    "guildMembers.userID": message.author.id
}, 
  {
    guildMembers: {
      $elemMatch: 
      {
        userID: message.author.id
      }}}, (err, userStat) => {
        if(!userStat) {
          serverStats.findOneAndUpdate(
            {
              guildId: message.guild.id
              }, 
                {
                  $addToSet: {
                    guildMembers: {
                      userID: message.author.id,
                      messageCount: 1,
                      punishmentsTiers: [],
                      medals: []
                    }
                  }
              }).exec()
        }
      }
    );


const dbResConfig = await serverConfig.findOne({
  guildId: message.guild.id
});


addOne(message, client, mongoose, serverStats, dbResConfig, dbResStats);
  if(user.guildMembers[0].messageCount >= 161 && dbResConfig && message.member.roles.cache.has(dbResConfig.newUserRole)) {
    message.member.roles.remove(dbResConfig.newUserRole);
  }

checkTiers(message, client, mongoose, serverStats, dbResConfig, dbResStats, user);

}


    }
    //Starts to Splice the Message, checking and removing command and prefix
    if(message.content.indexOf(client.prefix) !== 0) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g); 
    const command = args.shift().toLowerCase();
    //Get command from the ../commands file
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
  };

  const addOne = (message, client, mongoose, serverStats, dbResConfig, dbResStats, user) => {
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

  const checkTiers = async(message, client, mongoose, serverStats, dbResConfig, dbResStats, user) => {
    console.log(user.guildMembers[0].userID);
(user.guildMembers[0].punishmentsTiers).forEach(tier =>{
  if((parseInt(tier.TierForgiveness) + parseInt(tier.OffenderMsgCount)) <= parseInt(user.guildMembers[0].messageCount)) {
    console.log(tier.tierName);
    serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": message.author.id} , {
      $pull: {
        "guildMembers.$.punishmentsTiers": {
        tierName: tier.tierName,
        }
      }}, {multi: true}).exec();

      if(dbResStats.logChannel != "blank") {
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