exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed();
    const essFuncs = require('../../../utils/globalfuncs');
    
    let messages = essFuncs.collectMessage(client, message, 1);
    console.log(messages);
    embed.setTitle("Test");
    message.channel.send(embed);
};