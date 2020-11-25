exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const redis = require("../utils/redis");
    const ms = require('ms');
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

    const redisClient = await redis()


    
   const pollmsg = await message.channel.send(poll);
        pollmsg.react(client.emojis.resolveIdentifier("767083818199810088"));
        pollmsg.react(client.emojis.resolveIdentifier("767083772440608778"));

                
    try {
        console.log(`Message Author: ${pollmsg.id}`);
        const redisKey = `poll-${pollmsg.id}`
        await redisClient.set(redisKey, 'true', 'EX', time);
    } finally {
        redisClient.quit();
    }
    redisClient.quit();



    
}


module.exports.help = {
    name: "Poll",
    type: "Unity",
    aliases: [],
	desc: "Creates a Poll For Users to Respond to for a certain amount of time.",
	usage: "!!poll (time) (Question [Can have spaces])"
}

