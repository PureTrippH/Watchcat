const { Message } = require("discord.js");

module.exports = async (client, member) => {

  
  const serverConfig = require("../utils/schemas/serverconfig.js");
  const serverStats = require("../utils/schemas/serverstat.js");
  const redis = require("../utils/redis");
  const ms = require("ms");
  const Discord = require('discord.js');
  const welcomeEmb = new Discord.MessageEmbed();
  const mongoose = require('mongoose');

  const queries = require('../utils/queries/queries');
  await queries.queryUser(member.guild.id, member.id);

	const dbResConfig = await serverConfig.findOne({
		guildId: member.guild.id
  });

  console.log("haiii");
  const redisClient = await redis();


  welcomeEmb.setTitle(`Verification Reminder: ${member.guild.name}`);
  welcomeEmb.setDescription(`Welcome to ${member.guild.name}! If you are seeing this message, you need to verify. You can go to the Verification channel and type the message below`);
  welcomeEmb.addFields(
    { name: `!!Verify`, value: `^^ Verification Command`, inline: false }
  );
  welcomeEmb.setImage('https://tenor.com/view/room-boss-princess-peach-hell-lava-gif-5006792');
  welcomeEmb.setColor('#5c4e61');

  member.send(welcomeEmb);

  if(!(dbResConfig.unverifiedRole == "blank")) {
    member.roles.add(dbResConfig.unverifiedRole);
  }
  };