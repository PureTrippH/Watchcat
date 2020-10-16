exports.run = async (client, message, args) => {
	const fs = require("fs");
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed();

	embed.setColor('#92cfd6');
	embed.setTitle('Watchcat - Image Roulette');
	embed.setFooter('Note - The Developer of This Bot is not Responisble for any images on here. All of it lies in Imgurs system. If you see any content which is deemed inappropriate to the site, please report it to Imgur.');
	
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let linkArr = []

	let imgurString = 'https://i.imgur.com/'

	let strLength = 5;

	console.log(Math.floor((Math.random() * 6) + 5));


	for(let i = 0 ; i < strLength ; i++) {
		
		let randomChar = (chars.charAt(Math.floor(Math.random() * chars.length)));
		linkArr.push(randomChar);
		console.log(randomChar);
	}
	let charLink = (linkArr.reduce((a, b) => a + b));

	console.log(charLink);
	
	let newLink = imgurString + charLink + ('.jpg' || '.png');

	embed.setImage(newLink);

	message.author.send(embed).then(msg => {
		msg.delete({ timeout: 10000 });
	})

	console.log(newLink);

	
	linkArr = [];

}
module.exports.help = {
	name: "Role",
	type: "utility",
	aliases: ['roulette', 'roul', 'randimg'],
	desc: "Add or Remove a role from a user",
	usage: "!!role (user) (add/remove) (role)"
}