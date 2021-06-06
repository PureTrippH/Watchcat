const queries = require('../utils/queries/queries');
const serverStats = require("../utils/schemas/serverstat.js");

const queues = require('../commands/play').getQueue();
module.exports = async (client, oldMember, newMember) => {
  const tInf = await require('../commands/trivmode').getTrivChannels();
  let newUserChannel = newMember.channelID
  let oldUserChannel = oldMember.channelID

  if((oldUserChannel === null || oldUserChannel === undefined) && newUserChannel !== null && (oldMember.selfDeaf == false || newMember.selfDeaf == false) && newMember.selfMute == false) {
    if(tInf.has(newMember.channelID)) {
      newMember.voice.serverMute(true);
    }
    const joinDate = new Date();

    await serverStats.findOneAndUpdate({
      guildId: oldMember.guild.id, 
      "guildMembers.userID": oldMember.id
    },
    {
        "guildMembers.$.vcJoin": joinDate
    },
     {upsert: true}).exec();
     


  } else if(newUserChannel === null || oldMember.selfDeaf == true || newMember.selfDeaf == true || newMember.selfMute == true) {
    if(oldMember.id == "735559543886446712") {
      let servQueue = queues
        if(queues.get(oldMember.guild.id)) {
          queues.get(oldMember.guild.id).voice_channel = null;
        }
    }
    const user = await queries.queryUser(oldMember.guild.id, oldMember.id);

    const vcLeaveDate = new Date();
    const vcJoinedDate = new Date(user.guildMembers[0].vcJoin);
    if(tInf.has(oldMember.channelID)) {
      oldMember.voice.setMute(false);
    }
    const realTime = (vcLeaveDate - vcJoinedDate)
    await serverStats.findOneAndUpdate({
      guildId: oldMember.guild.id, 
      "guildMembers.userID": oldMember.id
    },
    {
      $inc:{
        "guildMembers.$.vcMinutes": Math.round(((realTime % 86400000) % 3600000) / 60000)
      }
    },
     {upsert: true}).exec();

  }
}
