const { kStringMaxLength } = require("buffer");

exports.run = async (client, message, args) => {
    const fs = require("fs");
	const ms = require("ms");
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed();
	const serverStats = require("../utils/schemas/serverstat.js");
	const queries = require("../utils/queries/queries.js");
	const Canvas = require('canvas');
	
	

	const levelBoard = Canvas.createCanvas(500, 200, {
        legend: {
			itemMaxWidth: 150,
			itemWrap: true
        }});
	
	const ctx = levelBoard.getContext("2d");
	const background = await Canvas.loadImage("https://img.wallpapersafari.com/desktop/1536/864/93/84/x7tXzR.jpg");
	const profilepic = await Canvas.loadImage(message.author.avatarURL({ format: "jpg"}));
	const user = await queries.queryUser(message.guild.id, message.author.id);

	ctx.font = "20px Arial";
	ctx.fillText("Test", 4, 4);
	ctx.drawImage(background, 0, 0, levelBoard.width, levelBoard.height);
	ctx.fillStyle = "rgba(57, 61, 72, 0.9)";
	ctx.fillRect(0,0,levelBoard.width, 50);
	ctx.font = "40px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(message.member.displayName, 15, 40);
	ctx.fillStyle = "yellow";
	(message.author.id == "168695206575734784") ? ctx.fillText("🏵️", 440, 37) : ctx.fillText("", 450, 30);
	ctx.font = "20px Arial";
	ctx.fillStyle = "White";
	ctx.fillText("- Messages -", 20, 75);
	ctx.textAlign = "center";
	ctx.fillText(user.guildMembers[0].messageCount, 75, 100);
	
	ctx.arc(400, 125, 65, 0, Math.PI * 2, true);
	ctx.lineWidth = 6;
	ctx.stroke();
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(profilepic, 335, 55, 134, 134);
	
	
	
	console.log();
	


	const exportImage = new Discord.MessageAttachment(levelBoard.toBuffer(), "levelBoard.png");
	
    embed.setColor('#e3bcf7');
    
    embed.setFooter('Credit to CEO of Racism#2051 for Level Equation');
    embed.setTimestamp();
	embed.attachFiles(exportImage);
	
	
    

	message.channel.send(embed);
}

module.exports.help = {
	name: "Tiers",
	type: "moderation",
	desc: "Shows server tiers",
	usage: "!!tiers (view)"
}