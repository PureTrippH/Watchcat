exports.announce = async (client, message) => { 
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed();

	const clubSchema = require("../../utils/schemas/club");
	const filter = m => m.author.id === message.author.id;

	let memberClub = await clubSchema.findOne({
			guildId: message.guild.id,
			leader: message.author.id
		});
	if(!memberClub || (message.author.id != memberClub.leader)) return message.author.send("You Are Not A Club Leader!");
	message.channel.send("Please Type Your Club Announcement Below:");
	await message.channel.awaitMessages(filter, {max:1}).then(collected => 
		{
			embed.setTitle(`Club Announcement: ${memberClub.clubName}`);
				
			(memberClub.members).forEach(async member => {
				embed.setColor('RANDOM');
				embed.setImage(`${memberClub.thumbnail}`);
				embed.setDescription(`
				**Announcement from ${message.author}**: 
			${collected.first().content}
			`);
				await message.guild.members.cache.get(member).send(embed);
			})
			
			
	});
};