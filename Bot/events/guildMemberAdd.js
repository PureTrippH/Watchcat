const { Message } = require("discord.js");

module.exports = async (client, member) => {
  console.log("test");
  const serverConfig = require("../utils/schemas/serverconfig.js");
  const serverStats = require("../utils/schemas/serverstat.js");
  const ms = require("ms");
  const Discord = require('discord.js');
  const welcomeEmb = new Discord.MessageEmbed();
  const mongoose = require('mongoose');
  const Canvas = require('canvas');

  const queries = require('../utils/queries/queries');

	const dbResConfig = await serverConfig.findOne({
		guildId: member.guild.id
  });

  if(dbResConfig.welcomeInfo) {
    const embed = new Discord.MessageEmbed();
    const welcomeBoard = Canvas.createCanvas(800, 300, {
      legend: {
    itemMaxWidth: 150,
    itemWrap: true
      }});

    const ctx = welcomeBoard.getContext("2d");
    const profilepic = await Canvas.loadImage(member.user.avatarURL({ format: "jpg"}));
    let background = await Canvas.loadImage(dbResConfig.welcomeInfo.joinImg);
    ctx.font = "20px Arial";
    ctx.fillText("Test", 4, 4);
    ctx.drawImage(background, 0, 0, welcomeBoard.width, welcomeBoard.height);

    ctx.fillStyle = "rgba(57, 61, 72, 0.9)";
    ctx.fillRect(0,0,welcomeBoard.width, 50);
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Hey ${member.displayName}!`, 15, 40);
    ctx.fillText(`#${member.guild.members.cache.filter(member => !member.user.bot).size}`, 650, 40);
    ctx.fillStyle = "yellow";

       
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#ffffff";
    ctx.arc(400, 175, 100, 0, Math.PI * 2, true);
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profilepic, 300, 74, 200, 200);
    
    const exportImage = new Discord.MessageAttachment(welcomeBoard.toBuffer(), "welcomeBoard.png");
    embed.setFooter('Be Sure to Verify with !!verify');
    embed.setTimestamp();
	  embed.attachFiles(exportImage);  
    client.channels.fetch(dbResConfig.welcomeInfo.welcomeChannel).then(msg => {
      msg.send(dbResConfig.welcomeInfo.welcomeText);
      msg.send(embed);
    })
  }

  if(!(dbResConfig.unverifiedRole == "blank")) {
    member.roles.add(dbResConfig.unverifiedRole);
  }
  };