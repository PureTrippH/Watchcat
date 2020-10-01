module.exports = async (client, member) => {

  
  const serverConfig = require("../utils/schemas/serverconfig.js");
  const serverStats = require("../utils/schemas/serverstat.js");
  const ms = require("ms");
  const mongoose = require('mongoose');
	const dbResConfig = await serverConfig.findOne({
		guildId: member.guild.id
  });
  
  await serverStats.findOneAndUpdate(
    {
      guildId: member.guild.id
      }, 
      {
        $addToSet: {
        guildMembers: {
          userID: member.id,
          messageCount: 1,
          punishmentsTiers: [],
          medals: []
        }
      }
    }).limit(1).lean();

  if(!(dbResConfig.unverifiedRole == "blank")) {
    member.roles.add(dbResConfig.unverifiedRole);
  }
  };