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

	const premUser = await queries.queryPremUser(message.guild.id, userScope.id);


	const levelBoard = Canvas.createCanvas(500, 200, {
        legend: {
			itemMaxWidth: 150,
			itemWrap: true
        }});
	
	const ctx = levelBoard.getContext("2d");

	const background = (!premUser) ?  ( await Canvas.loadImage("https://img.wallpapersafari.com/desktop/1536/864/93/84/x7tXzR.jpg")) : (await Canvas.loadImage(premUser.background));
	const medal = (!premUser || premUser.Medal == "blank") ? "blank" : (await Canvas.loadImage(premUser.Medal));


	const userInf = await getUserLevel(user.guildMembers[0].messageCount)

	let userLevel = userInf.level;


	console.log(userLevel);
	userInf.totalMsg.pop();

	let lastMessageCount = (userInf.totalMsg.reduce((a, b) => a + b, 0));
	const difUser = user.guildMembers[0].messageCount - lastMessageCount;
	const dif = userInf.msgCount - lastMessageCount;

	const percentOf300 = (difUser/dif) * 300;

	console.log(percentOf300);


	
	const profilepic = await Canvas.loadImage(userScope.avatarURL({ format: "jpg"}));

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

	if(premUser && premUser.Medal != `blank`) {
		ctx.drawImage(medal, 425, 0, 50, 50);
	}
	
	
	ctx.font = "20px Arial";
	ctx.fillStyle = "White";
	ctx.fillText("- Messages -", 20, 75);

	ctx.font = "20px Arial";
	ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
	ctx.strokeText("- Messages -", 20, 75);
	ctx.textAlign = "center";
	ctx.lineWidth = 1;
	ctx.strokeText(user.guildMembers[0].messageCount, 75, 100);

	ctx.font = "20px Arial";

	ctx.textAlign = "center";
	ctx.fillText(user.guildMembers[0].messageCount, 75, 100);
	

		ctx.fillStyle = "#d6a7eb";
		ctx.fillRect(60, 155, percentOf300, 25);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000000"
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = "#000000";
		ctx.fillRect(60, 155, 300, 25);
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.strokeRect(60, 155, 300, 25);
		ctx.stroke();



	ctx.globalAlpha = 1;
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#ffffff";
	ctx.arc(400, 125, 65, 0, Math.PI * 2, true);
	ctx.lineWidth = 6;
	ctx.stroke();
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(profilepic, 335, 55, 134, 134);


	
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

	


	const exportImage = new Discord.MessageAttachment(levelBoard.toBuffer(), "levelBoard.png");
	
    embed.setColor('#e3bcf7');
    
    embed.setFooter('Credit to CEO of Racism#2051 for Level Equation');
    embed.setTimestamp();
	embed.attachFiles(exportImage);
	
	
    

	message.channel.send(embed);
}

const getUserLevel = async(msgCountCurrent) => {
	let sumArr = [];
	let sumTot = 0;
	let levelCount = 0;
	let msgCount = 0;
	let respArray = [];

	for(let i = 0 ; msgCount < msgCountCurrent ; i++) {
	sumTot = 100*(i)^(1/2);
	sumArr.push(sumTot);
	msgCount = sumArr.reduce((a, b) => a + b, 0);
	levelCount = i	
	};
	respArray.push(levelCount, msgCount);

	console.log(`Full Array: ${sumArr}`);

	return {
		level: levelCount,
		msgCount: msgCount,
		totalMsg: sumArr
	};
}

module.exports.help = {
	name: "Stats/Rank",
	type: "fun",
	aliases: ["s", "rank"],
	desc: "Shows you your server Level and Exp",
	usage: "!!(stats, rank, s) [user]"
}