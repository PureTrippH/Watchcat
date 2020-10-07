const { kStringMaxLength } = require("buffer");

exports.run = async (client, message, args) => {
    const fs = require("fs");
	const ms = require("ms");
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed();
	const serverStats = require("../utils/schemas/serverstat.js");
	const queries = require("../utils/queries/queries.js");
	const Canvas = require('canvas');
	const userScope = (!message.mentions.users.first()) ? message.author : message.mentions.users.first();
	const userScopeMem = (!message.mentions.members.first()) ? message.member : message.mentions.members.first();
	
	const user = await queries.queryUser(message.guild.id, userScope.id);




	const levelBoard = Canvas.createCanvas(500, 200, {
        legend: {
			itemMaxWidth: 150,
			itemWrap: true
        }});
	
	const ctx = levelBoard.getContext("2d");

	console.log(userScope);
	const background = await Canvas.loadImage("https://img.wallpapersafari.com/desktop/1536/864/93/84/x7tXzR.jpg");
	const gemMedal = await Canvas.loadImage("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/gem-stone_1f48e.png");
	const evanMedal = await Canvas.loadImage("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/abacus_1f9ee.png");
	const laelaMedal = await Canvas.loadImage("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/joypixels/257/black-cat_1f408-200d-2b1b.png");
	const yamMedal = await Canvas.loadImage("https://cdn.discordapp.com/emojis/736115271462420540.png?v=1");

	
	const profilepic = await Canvas.loadImage(userScope.avatarURL({ format: "jpg"}));

	yamMedal

	ctx.font = "20px Arial";
	ctx.fillText("Test", 4, 4);
	ctx.drawImage(background, 0, 0, levelBoard.width, levelBoard.height);
	ctx.fillStyle = "rgba(57, 61, 72, 0.9)";
	ctx.fillRect(0,0,levelBoard.width, 50);
	ctx.font = "40px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(userScopeMem.displayName, 15, 40);
	ctx.fillStyle = "yellow";
	//These are temp. Will add to database when fully complete.
	(userScope.id == "168695206575734784") ? ctx.drawImage(gemMedal, 425, 0, 50, 50) : ctx.fillText("", 450, 30);
	(userScope.id == "377276565765226497") ? ctx.drawImage(evanMedal, 425, 0, 50, 50) : ctx.fillText("", 450, 30);
	(userScope.id == "534147582964924426") ? ctx.drawImage(laelaMedal, 425, 0, 50, 50) : ctx.fillText("", 450, 30);
	(userScope.id == "357204785604329474") ? ctx.drawImage(yamMedal, 425, 0, 50, 50) : ctx.fillText("", 450, 30);
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
	
	let userLevel = await getUserLevel(user.guildMembers[0].messageCount);
	
	ctx.font = "70px Arial";
	ctx.textAlign = "center";
	ctx.fillText(userLevel.toString(), 400, 155);
	ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
	ctx.strokeText(userLevel.toString(), 400, 155);
	

	ctx.font = "20px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Level", 400, 95);
	ctx.lineWidth = 0.5;
	ctx.strokeText("Level", 400, 95);


	
	
	
	
	console.log();
	


	const exportImage = new Discord.MessageAttachment(levelBoard.toBuffer(), "levelBoard.png");
	
    embed.setColor('#e3bcf7');
    
    embed.setFooter('Credit to CEO of Racism#2051 for Level Equation');
    embed.setTimestamp();
	embed.attachFiles(exportImage);
	
	
    

	message.channel.send(embed);
}

const getUserLevel = async(msgCountCurrent) => {
	let sumArr = []
	let sumTot = 0
	let levelCount = 0
  	let msgCount = 0;

	for(let i = 0 ; msgCount < msgCountCurrent ; i++) {
	sumTot = 100*(i)^(1/2);
	sumArr.push(sumTot);
	msgCount = sumArr.reduce((a, b) => a + b, 0);
	levelCount = i	
	};
	return levelCount;
}

module.exports.help = {
	name: "Tiers",
	type: "moderation",
	desc: "Shows server tiers",
	usage: "!!tiers (view)"
}