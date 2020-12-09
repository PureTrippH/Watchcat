exports.runEmbed = async (client, message, clubName) => { 
	const Discord = require("discord.js");
	const embed = new Discord.MessageEmbed();

	const clubSchema = require("../../utils/schemas/club");
	let memberClub = await clubSchema.findOne({
			clubName: clubName
		}).limit(1);
	if(!memberClub) return message.author.send("Club Not Found!");
	embed.setTitle(`Club: ${memberClub.clubName}`);
	embed.setImage(`${memberClub.thumbnail}`);
	embed.setThumbnail(`${memberClub.thumbnail}`);
	embed.setDescription(`${memberClub.desc}`);
	embed.addFields({ name: `Leader:`, value: `<@${memberClub.leader}>`, inline: false });
	embed.addFields({ name: `Members:`, value: `${loopUsers(memberClub.members)}`, inline: false });
	message.channel.send(embed);

}

const loopUsers = (users) => {
	let masterString = "";
	users.forEach(user => {
		masterString += `<@${user}>, `
	})
	return masterString;
};