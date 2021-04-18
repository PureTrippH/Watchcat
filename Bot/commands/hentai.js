const fetch = require('node-fetch');
const puppet = require('puppeteer');
const fs = require("fs");
const Discord = require('discord.js');
exports.run = async (client, message, args) => {
	const browser = await puppet.launch({
		headless: true,
		args: ['--no-sandbox']
		});
		
	const page = await browser.newPage();
	let pageNum = 1;
	let loadEmbed = new Discord.MessageEmbed;
	loadEmbed.setTitle("Loading Hentai!");
	loadEmbed.setDescription("Finding the Right Hentai takes some time! Please Be Patient!");
	loadEmbed.setThumbnail('https://i2.wp.com/onemansblog.com/wp-content/uploads/2016/05/Octopus-Loading.gif?fit=800%2C600&ssl=1');
	message.channel.send(loadEmbed);
	let hentaiLink = await validLink(page);
	this.nextPage(hentaiLink, pageNum, message, page);


}

exports.nextPage = async (hentaiLink, pageNum, message, page)  => {
	const embed = new Discord.MessageEmbed;
	embed.setAuthor('nhentai');
	console.log(hentaiLink + `/${pageNum}`);
	await page.goto(hentaiLink + `/${pageNum}`);
	await page.waitForSelector('img');
	let data = await page.evaluate(() => {
		const images = document.querySelectorAll('img');
		const urls = Array.from(images).map(v => v.src);
		return urls;
	})
	embed.setTitle("Your Mystery Hentai:");
	console.log(data);
	embed.setImage(data[1]);
	let msg = await message.author.send(embed);
	msg.react('➡️');
	msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '➡️':
				return this.nextPage(hentaiLink, pageNum+1, message, page);
			break;
		}
	});
}



const getRandomUrl = (linkArr) => {
	const chars = '0123456789';
	let rand = Math.floor(Math.random() * 6) + 1;
	for(let i = 0 ; i < rand ; i++) {
		let randomChar = (chars.charAt(Math.floor(Math.random() * chars.length)));
		linkArr.push(randomChar);
	}
	if(rand <3 && (Math.floor(Math.random() * 5) + 1) != 2) {
		return getRandomUrl([]);
	}
	return (linkArr.reduce((a, b) => a + b));
}


const validLink = async (page) => {
	let linkArr = [];
	//getRandomUrl(linkArr)
	let newLink = 'https://nhentai.net/g/' + `${getRandomUrl(linkArr)}`;
	console.log(newLink);
	try {
	await page.goto(newLink);
	} catch(err) {
		console.log(`HENTAI ERROR: ${err}`);
		validLink()
	}
	await page.waitForSelector('img');
	let data = await page.evaluate(() => {
		const images = document.querySelectorAll('img');
		const urls = Array.from(images).map(v => v.src);
		return urls;
	})
	if(data.length == 1) {
		return validLink(page);
	} else {
		return newLink
	}
}


module.exports.help = {
	name: "Hentai",
	type: "fun",
	aliases: ['hentai', 'doujin'],
	desc: `Well then... YOU DEGENERATE! WHY WOULD U USE THIS COMMAND!?!? Believe me I didnt want to make it but demand is demand.
	Essentially, the command is the same as the manga command, but instead.... its doujin..... Yeah...... I hope you enjoy your
	weird sexual fantasies you will never live out you nerd. (Dev Note: BY USING THIS COMMAND, YOU ARE CONFIRMING YOU ARE 18+)
	`,
	usage: "!!hentai",
	gif: "https://cdn.discordapp.com/attachments/732237195980701820/820506242060517396/unknown.png"
}