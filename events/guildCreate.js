module.exports = async (client, guild) => {
  const mongoose = require('mongoose');
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
}