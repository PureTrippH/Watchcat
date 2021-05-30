exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed();

    embed.setTitle("Test");
    message.channel.send(embed);
};



exports.sendPage(reviewNum);