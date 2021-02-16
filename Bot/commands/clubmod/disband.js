exports.disband = async (client, message) => { 
    const clubSchema = require("../../utils/schemas/club");
    const Discord = require("discord.js");
    const embed = new Discord.MessageEmbed();

    
    if(message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send("Enter Club Name");
        const msg = message.channel.awaitMessages(m => m.author.id === message.author.id, {
			max: 1
		}).then(async collection => {
            let memberClub = await clubSchema.findOne({
                clubName: (collection.first().content).toLowerCase()
            })
            memberClub.deleteOne().then(() => {
                return message.author.send("Successfully Disbanded Club");
            });
        })
    }
    if(memberClub) {
        let memberClub = await clubSchema.findOne({
            guildId: message.guild.id,
            leader: message.author.id
        })

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