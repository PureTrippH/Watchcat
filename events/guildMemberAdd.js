module.exports = async (client, member) => {

  
  const serverConfig = require("../utils/schemas/serverconfig.js");
  const serverStats = require("../utils/schemas/serverstat.js");
  const ms = require("ms");
  const mongoose = require('mongoose');
	const dbResConfig = await serverConfig.findOne({
		guildId: member.guild.id
  });
  
  member.send(`Hello and Welcome to ${member.guild.name}! Please check the Information channel for Info and verify in the verification channel!`);
  if(!(dbResConfig.unverifiedRole == "blank")) {
    member.roles.add(dbResConfig.unverifiedRole);
  }
  };