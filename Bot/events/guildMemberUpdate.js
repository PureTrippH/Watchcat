const { Message } = require("discord.js");
const discord = require('discord.js');
const queries = require('../utils/queries/queries');

module.exports = async (client, oldMember, newMember) => {
  const serverStats = require("../utils/schemas/serverstat.js");
  let user = await queries.queryUser(newMember.guild.id, newMember.id);
  if(!oldMember.roles.cache.get("725293383731380271") && newMember.roles.cache.get("725293383731380271")) {
    if(user.guildMembers[0].boosting) {
      await newMember.roles.add(user.guildMembers[0].boosterRole);
      return;
    }
    let role = await oldMember.guild.roles.create({
      data: {
        name: `${newMember.nickname}'s Role`,
        color: 'RANDOM',
      },
      reason: 'New Booster!!!',
    });
    role.setPosition(32);
    await serverStats.findOneAndUpdate({
			guildId: oldMember.guild.id, 
			"guildMembers.userID": oldMember.id
  		},
  		{
        "guildMembers.$.boosting": true,
	  		"guildMembers.$.boosterRole": role.id
  		},
   		{upsert: true}).exec();
      await newMember.roles.add(role);
	}

  if(oldMember.roles.cache.get("725293383731380271") && !newMember.roles.cache.get("725293383731380271")) {
      console.log(user);
      await newMember.roles.remove(user.guildMembers[0].boosterRole);
  }
};
