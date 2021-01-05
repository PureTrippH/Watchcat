exports.reset = async (client, message) => {
  const serverStats = require("../../utils/schemas/serverstat.js");
  const usermap = message.guild.members.cache.map(members => members.id);

  console.log(usermap);
}

/*
  message.delete({ timeout: 200 });
  let parsedNum = parseInt(args[2]);

  serverStats.updateOne(
    {
      guildId: message.guild.id, 
      "guildMembers.userID": tagged.id
    }, 
    {
      "guildMembers.$.messageCount":parsedNum
    }).exec();

*/