const queries = require('../utils/queries/queries');
const serverStats = require("../utils/schemas/serverstat.js");


module.exports = async (client, oldMember, newMember) => {
  const tInf = await require('../commands/trivmode').getTrivChannels();
  let newUserChannel = newMember.channelID
  let oldUserChannel = oldMember.channelID

  if((oldUserChannel === null || oldUserChannel === undefined) && newUserChannel !== null && (oldMember.selfDeaf == false || newMember.selfDeaf == false) && newMember.selfMute == false) {
    
    console.log("User joined");
    if(tInf.has(newMember.channelID)) {
      newMember.voice.serverMute(true);
    }
    const joinDate = new Date();

    serverStats.findOneAndUpdate({
      guildId: oldMember.guild.id, 
      "guildMembers.userID": oldMember.id
    },
    {
        "guildMembers.$.vcJoin": joinDate
    },
     {upsert: true}).exec();
     


  } else if(newUserChannel === null || oldMember.selfDeaf == true || newMember.selfDeaf == true || newMember.selfMute == true) {
    console.log("User Left");
    const user = await queries.queryUser(oldMember.guild.id, oldMember.id);

    const vcLeaveDate = new Date();
    const vcJoinedDate = new Date(user.guildMembers[0].vcJoin);
    if(tInf.has(oldMember.channelID)) {
      console.log("yes");
      oldMember.voice.setMute(false);
    }
    const msInbetween = Math.trunc((vcLeaveDate - vcJoinedDate)/(1000*60));  
    console.log(msInbetween);
    let realTime = (msInbetween*2);
    serverStats.findOneAndUpdate({
      guildId: oldMember.guild.id, 
      "guildMembers.userID": oldMember.id
    },
    {
      $inc:{
        "guildMembers.$.messageCount": realTime
      }
    },
     {upsert: true}).exec();

  }
}
