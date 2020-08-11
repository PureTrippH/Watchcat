module.exports = async (client, message) => {
    const serverSettings = require("../data/serversettings.json");
    const mongoose = require('mongoose');
    const serverStats = require("../utils/schemas/serverstat.js");
    if(message.author.bot) return;
    
//Check if Guild Exists in Mongo Collection
const triggerWords = ["sex", "cum", "jizz", "dick", "clit", "vagina", "porn", "jerk off", "hentai", "penis", "testicles", "pussy"];
const participants = ["585842334118314008", "315659296539148289", "357204785604329474", "692841053044080641", "536682455311319040", "700214206808719432", "600381224674000918", "476551304852799489", ""]

//Check if Guild Exists in Mongo Collection

if(message.guild) {

if(message.guild.id == "709865844670201967") {
  console.log("ok Cool");
triggerWords.forEach(word => {
  if(message.content.includes((word).toLowerCase()) && participants.findIndex(indiv => indiv == message.author.id) != -1) {
    
    message.author.send("You have been flagged as horny during the monk challenge. Notifying other participants...");
  }
})

}
/*
Query the Database to Increment total server message count, Add New Users to Database and Such. 
Is it efficient? No probably not,
but lets give it a shot for now.
*/
const thisStats = await serverStats.findOne({
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

const serverConfig = require("../utils/schemas/serverconfig.js");

const dbResStats = await serverStats.findOne({
  guildId: message.guild.id
});

const getServerSettings = await serverConfig.findOne({
  guildId: message.guild.id
});


await addOne(message, client, mongoose, serverStats, getServerSettings, dbResStats);
thisStats.guildMembers.forEach(key =>{
  if(key.messageCount >= 200 && key.userID == message.author.id && getServerSettings && message.member.roles.cache.has(getServerSettings.newUserRole)) {
    message.member.roles.remove(getServerSettings.newUserRole);
  }
});

await checkTiers(message, client, mongoose, serverStats, getServerSettings, dbResStats);




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

  const addOne = (message, client, mongoose, serverStats, getServerSettings, dbResStats) => {
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
        serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": message.author.id} , {
          $inc:{
            "guildMembers.$.messageCount":1
          }}).exec();
  }

  const checkTiers = async(message, client, mongoose, serverStats, getServerSettings, dbResStats) => {
    const userIndex = dbResStats.guildMembers.findIndex(user => user.userID === message.author.id);
  if(!dbResStats.guildMembers[userIndex]) return console.log("Sadchamp");;
dbResStats.guildMembers[userIndex].punishmentsTiers.forEach(tier =>{
  console.log((parseInt(tier.TierForgiveness) + parseInt(tier.OffenderMsgCount)));
  console.log(dbResStats.guildMembers);
  if((parseInt(tier.TierForgiveness) + parseInt(tier.OffenderMsgCount)) <= parseInt(dbResStats.guildMembers[userIndex].messageCount)) {

    console.log("Poggers")
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
          description: `Tier Forgiven: ${message.author.username}`,
          title: `User: ${tagged}`,
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