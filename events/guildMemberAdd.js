module.exports = async (client, member) => {

  
  const serverConfig = require("../utils/schemas/serverconfig.js");
  const serverStats = require("../utils/schemas/serverstat.js");
  const ms = require("ms");
  const mongoose = require('mongoose');
	const dbResConfig = await serverConfig.findOne({
		guildId: member.guild.id
  });
  if(!(dbResConfig.unverifiedRole == "blank")) {
    member.roles.add(dbResConfig.unverifiedRole);
  }
  };