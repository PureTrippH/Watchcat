exports.run = async (client, message, args) => {
	const fs = require("fs");
	const Discord = require('discord.js');
	
	const embed = new Discord.MessageEmbed();

	embed.setColor('#92cfd6');
	embed.setTitle('Watchcat - Image Roulette');
	embed.setFooter('Note - The Developer of This Bot is not Responisble for any images on here. All of it lies in Imgurs system. If you see any content which is deemed inappropriate to the site, please report it to Imgur.');

	const link = await validLink();

	message.delete({ timeout: 2000 });
	
	embed.setImage(link);
	

	message.author.send(embed).then(msg => {
		msg.delete({ timeout: 10000 });
	})

}
module.exports.help = {
	name: "Roulette",
	type: "fun",
	aliases: ['roulette', 'roul', 'randimg', 'luck'],
	desc: "Serves a Random Image in your DMs (NOTE: Watchcat Developer not responsible for content of images)",
	usage: "!!roulette",
	gif: "https://cdn.discordapp.com/attachments/820466229353119745/820467079991787540/2021-03-13_20-20-38_1.gif"
}

const getRandomUrl = (linkArr, randAmt) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let rand = Math.floor(Math.random() * 7) + 5;

	for(let i = 0 ; i < randAmt ; i++) {
		let randomChar = (chars.charAt(Math.floor(Math.random() * chars.length)));
		linkArr.push(randomChar);
	}
	return (linkArr.reduce((a, b) => a + b));
}


const validLink = async () => {
	

	let linkArr = [];

	const Canvas = require('canvas');

	let imgurString = 'https://i.imgur.com/';

	let newLink = imgurString + getRandomUrl(linkArr, 5) + '.jpg'

	const background = await Canvas.loadImage(newLink);

	if(background.width == 161) {
		newLink = '';
		return validLink();
	} else {
		return newLink;
	}
}