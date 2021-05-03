exports.run = async (client, message, args) => {
    const queries = require('../utils/queries/queries');
    const Discord = require('discord.js');
    let booster = await queries.queryUser(message.guild.id, message.author.id);
    if(!booster.guildMembers[0].boosterRole) return message.author.send("You Are Not Boosting Los Lechugas!");
    const embed = new Discord.MessageEmbed();
    embed.setDescription("Thank you For Boosting!");
    embed.setTitle("Booster Panel!");
    embed.addFields({ name: `1️⃣`, value: `Change Name`});
    embed.addFields({ name: `2️⃣`, value: `Change Color`});
    message.channel.send(embed).then(msg => {
        msg.react('1️⃣');
        msg.react('2️⃣');
        msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			console.log(reaction);
			switch(reaction) {
                case '1️⃣':
                    message.channel.send("Please Enter A Name For Your Role:");
                    message.guild.roles.cache.get(booster.guildMembers[0].boosterRole).setName(await collectMsg(message));
                break;
                case '2️⃣':
                    message.channel.send("Please Enter A Color (Example: #ff00ff):");
                    message.guild.roles.cache.get(booster.guildMembers[0].boosterRole).setColor(await collectMsg(message));
                break;
            }
        });
    });
}

const collectMsg = async(message) => {
    const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1
    })
    return msg.first().content;
}

module.exports.help = {
    name: "Los Lechugas Booster",
    type: "utility",
    aliases: ["br", "boost"],
	desc: "(Los Lechugas Only). Allows Server Boosters to customize their booster perks (such as Custom Role)",
	usage: "!!br",
    gif: "https://cdn.discordapp.com/attachments/812808586890838046/812810505743499314/2021-02-20_17-14-34_1.gif"
}
