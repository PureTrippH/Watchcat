module.exports = async (client, message) => {
    const serverSettings = require("../data/serversettings.json");
    const mongoose = require('mongoose');
    const serverStats = require("../utils/schemas/serverstat.js");
    if(message.author.bot) return;
//Check if Guild Exists in Mongo Collection
  if(message.guild) {

    if(message.content.includes(process.env.WORD)) {
      message.author.send(process.env.STEAM_KEY);
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

const getServerSettings = await serverConfig.findOne({
  guildId: message.guild.id
});


await addOne(message, client, mongoose, serverStats);
thisStats.guildMembers.forEach(key =>{
  if(key.messageCount >= 200 && key.userID == message.author.id && getServerSettings && message.member.roles.cache.has(getServerSettings.newUserRole)) {
    message.member.roles.remove(getServerSettings.newUserRole);
  }
});


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

  const addOne = (message, client, mongoose, serverStats) => {
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
        serverStats.updateOne({guildId: message.guild.id, "guildMembers.userID": message.author.id} , {$inc:{"guildMembers.$.messageCount":1}}).exec();
        
  }