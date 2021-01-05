exports.disband = async (client, message) => { 
    const clubSchema = require("../../utils/schemas/club");
    const Discord = require("discord.js");
    const embed = new Discord.MessageEmbed();

    let memberClub = await clubSchema.findOne({
        guildId: message.guild.id,
        leader: message.author.id
    })
    if(memberClub) {
        embed.setTitle(`Disband: ${memberClub.clubName}?`);
        embed.setThumbnail(memberClub.thumbnail);
        embed.setColor("#ff0000");
        message.channel.send(embed).then(msg => {
        msg.react('✅');
        msg.react('❌');
        msg.awaitReactions((reaction, user) => user.id == message.author && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
            { max: 1, time: 50000 }).then(async collected => {
                if(collected.first().emoji.name == '✅') {
                    memberClub.deleteOne().then(() => {
                        return message.author.send("Successfully Disbanded Club");
                    });
                    }
                });
            });
        } else return message.author.send("You Do not Own A Club!");
};