exports.listClubs = async (client, message) => { 
const Discord = require('discord.js');
const embed = new Discord.MessageEmbed();
    
    const clubSchema = require("../../utils/schemas/club");
	let memberClub = await clubSchema.find({
            guildId: message.guild.id,
        });
        if(!memberClub) return message.author.send("Club Does Not Exist");
        console.log(memberClub);
        embed.setTitle("Server Clubs -");
        embed.setColor('RANDOM');
        memberClub.forEach(club => {
            embed.addFields(
                { name: `${club.clubName}`, value: `${club.desc}`, inline: false }
              );
        })
    message.author.send(embed);
        
};