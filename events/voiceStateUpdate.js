const queries = require('../utils/queries/queries');
const mongoose = require('mongoose');
const serverStats = require("../utils/schemas/serverstat.js");
const serverConfig = require("../utils/schemas/serverconfig.js");

module.exports = async (client, oldMember, newMember) => {
  
  let newUserChannel = newMember.channelID
  let oldUserChannel = oldMember.channelID


  console.log(oldMember.selfDeaf);

  if((oldUserChannel === null || oldUserChannel === undefined) && newUserChannel !== null && (oldMember.selfDeaf == false || newMember.selfDeaf == false)) {
    
    console.log("User joined");

    const joinDate = new Date();

    serverStats.findOneAndUpdate({
      guildId: oldMember.guild.id, 
      "guildMembers.userID": oldMember.id
    },
    {
        "guildMembers.$.vcJoin": joinDate
    },
     {upsert: true}).exec();
     


  } else if(newUserChannel === null || oldMember.selfDeaf == true || newMember.selfDeaf == true) {
    console.log("User Left");
    const user = await queries.queryUser(oldMember.guild.id, oldMember.id);

    const vcLeaveDate = new Date();
    const vcJoinedDate = new Date(user.guildMembers[0].vcJoin);

    const msInbetween = Math.trunc((vcLeaveDate - vcJoinedDate)/(1000*60));  
    console.log(msInbetween);
    serverStats.findOneAndUpdate({
      guildId: oldMember.guild.id, 
      "guildMembers.userID": oldMember.id
    },
    {
      $inc:{
        "guildMembers.$.messageCount":msInbetween*4
      }
    },
     {upsert: true}).exec();

  }
}
