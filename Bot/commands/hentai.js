const fetch = require('node-fetch');
const puppet = require('puppeteer');
const fs = require("fs");
const Discord = require('discord.js');
let webBrowsers = [];
exports.run = async (client, message, args) => {
	if(message.guild.id == "709865844670201967") return message.channel.send(`Haha ${message.author} you thought you could get hentai on a teen server. Horny bastard u arent 18+`);
	let pageNum = 1;
	if(webBrowsers.length == 0) {
		const contentBrowser = await puppet.launch({
			headless: true,
			args: ['--no-sandbox']
		});
		webBrowsers.push(contentBrowser);
	}
	let loadEmbed = new Discord.MessageEmbed;
	loadEmbed.setTitle("Loading Hentai!");
	loadEmbed.setDescription("Finding the Right Hentai takes some time! Please Be Patient!");
	loadEmbed.setThumbnail('https://i2.wp.com/onemansblog.com/wp-content/uploads/2016/05/Octopus-Loading.gif?fit=800%2C600&ssl=1');
	loadEmbed.setFooter("Just Move on if there is Loli. I sadly cant filter it out ;-;");
	message.channel.send(loadEmbed);
	if(args[0]) {
		this.nextPage(`https://nhentai.net/g/${args[0]}`, pageNum, message);
	}
	this.nextPage(await validLink(), pageNum, message);


}

exports.nextPage = async (hentaiLink, pageNum, message)  => {

	const nextPage = await goToPage(hentaiLink + `/${pageNum}`);
	const embed = new Discord.MessageEmbed;
	embed.setAuthor('nhentai');
	console.log(nextPage);

	embed.setTitle("Your Mystery Hentai:");
	embed.setImage(nextPage[1]);
	let msg = await message.author.send(embed);
	msg.react('➡️');
	msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(collection => {
		let reaction = collection.first().emoji.name;
		switch(reaction) {
			case '➡️':
				return this.nextPage(hentaiLink, pageNum+1, message);
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
	if((rand <3 || linkArr >= 1000) && (Math.floor(Math.random() * 3) + 1) != 2) {
		return getRandomUrl([]);
	}
	return (linkArr.reduce((a, b) => a + b));
}


const validLink = async (page) => {
	let linkArr = [];
	//getRandomUrl(linkArr)
	let newLink = 'https://nhentai.net/g/' + `${getRandomUrl(linkArr)}`;
	const pageData = await goToPage(newLink);
	if(pageData.length == 1) {
		return validLink(page);
	} else {
		return newLink
	}
}

const goToPage = async(link) => {
	const browser = webBrowsers[0];
	const contPage = await browser.newPage();
	await contPage.goto(link);
	await contPage.waitForSelector('img');
	let data = await contPage.evaluate(() => {
		const images = document.querySelectorAll('img');
		const urls = Array.from(images).map(v => v.src);
		return urls;
	});
	await contPage.close();
	return data;
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
