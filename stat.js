exports.run = async (client, message, args) => {
    const fs = require("fs");
	const ms = require("ms");
	const Discord = require('discord.js');
	const queries = require("../utils/queries/queries.js");
	const Canvas = require('canvas');
	
    const statEmb = new Discord.MessageEmbed();

	const levelBoard = Canvas.createCanvas(500, 200, );
	
	const ctx = levelBoard.getContext("2d");
	const background = await Canvas.loadImage("https://cdn.pixabay.com/photo/2016/02/11/14/59/fruits-1193727__340.png");


	const exportImage = new Discord.MessageAttachment(levelBoard.toBuffer(), "levelBoard.png");
    statEmb.setColor('#e3bcf7');
    
    statEmb.setFooter('Credit to CEO of Racism#2051 for Level Equation');
    statEmb.setTimestamp();
	statEmb.attachFiles(exportImage);
	
	message.channel.send(statEmb);
}

module.exports.help = {
	name: "Tiers",
	type: "moderation",
	desc: "Shows server tiers",
	usage: "!!tiers (view)"
}