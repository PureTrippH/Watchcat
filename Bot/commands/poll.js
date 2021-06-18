exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const redis = require("../utils/redis");
    const ms = require('ms');
    const mongoose = require('mongoose');
    const pollSchema = require('../utils/schemas/poll');
    const poll = new Discord.MessageEmbed();
    if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.author.send('You Need permission to cast a poll');
    if(!args[0]) return message.author.send("You MUST need a Poll Time");
    if(!args[1]) return message.author.send("You MUST need a Poll Title to start a Poll");

    const time = (ms(args[0]) / 1000);

    delete args[0];

    message.delete();
    poll.setTitle(`Poll: ${args.join(" ")}`);
    poll.setColor("ff0000");

    poll.addFields({ name: `Positive:`, value: `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`, inline: true }, { name: `Negative:`, value: `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`, inline: true });
    
   const pollmsg = await message.channel.send(poll);
    pollmsg.react(client.emojis.resolveIdentifier("767083818199810088"));
    pollmsg.react(client.emojis.resolveIdentifier("767083772440608778"));

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + time);
    let newPoll = new pollSchema({
        _id: mongoose.Types.ObjectId(),
        guildId: message.guild.id,
        endDate: expires,
        channel: pollmsg.channel.id,
        message: pollmsg.id,
        author: message.author.id,
        type: 'default'
    });
    newPoll.save();
}


module.exports.help = {
    name: "Poll",
    type: "Unity",
    aliases: [],
	desc: "Creates a Poll For Users to Respond to for a certain amount of time. You can either respond with Check (yes) or X (No), and Watchcat will reflect the change",
	usage: "!!poll (time) (Question [Can have spaces])",
    gif: "https://cdn.discordapp.com/attachments/812811887305031720/812813059826909184/2021-02-20_17-25-12.gif"
}

