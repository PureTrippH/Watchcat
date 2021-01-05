exports.addmsg = async (client, message, args, tagged) => {
  const serverStats = require("../../utils/schemas/serverstat.js");

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
}