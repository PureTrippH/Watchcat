exports.run = async (client, message, args) => {
    const fs = require("fs");
	const ms = require("ms");
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed();
	const serverStats = require("../utils/schemas/serverstat.js");
	const queries = require("../utils/queries/queries.js");
	const Canvas = require('canvas');
	
	

	const levelBoard = Canvas.createCanvas(500, 200);
	
	const ctx = levelBoard.getContext("2d");
	const background = await Canvas.loadImage("https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500");
	ctx.drawImage(background, 0, 0, levelBoard.width, levelBoard.height);
	ctx.fillStyle = "rgba(57, 61, 72, 0.6)";
	ctx.fillRect(0,0,levelBoard.width, 50);
	ctx.quadraticCurveTo(0,0,255,2);
	const exportImage = new Discord.MessageAttachment(levelBoard.toBuffer(), "levelBoard.png");
    embed.setColor('#e3bcf7');
    
    embed.setFooter('Credit to CEO of Racism#2051 for Level Equation');
    embed.setTimestamp();
	embed.attachFiles(exportImage);
	
    ctx.font="50px Arial";
	ctx.lineWidth = 1;
	ctx.strokeStyle= "black"
    ctx.strokeText("Test", 0, 0);

	message.channel.send(embed);
}

module.exports.help = {
	name: "Tiers",
	type: "moderation",
	desc: "Shows server tiers",
	usage: "!!tiers (view)"
}