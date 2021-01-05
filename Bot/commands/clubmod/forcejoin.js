exports.forceJoin = async (client, message, filter) => { 
message.channel.send("Please Enter The Club Name Then User ID To Force Join:");
message.channel.awaitMessages(filter, {max:2}).then(async collected => {
    
    const clubSchema = require("../../utils/schemas/club");
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.author.send("Admin Perms Denied: You may not ");
	let memberClub = await clubSchema.findOne({
            guildId: message.guild.id,
            clubName: (collected.first().content).toLowerCase()
        });
        console.log(memberClub);
        memberClub.updateOne({
            $push: {
                members: (collected.last().content).toLowerCase()
            }
        }).then(async() => {
            message.guild.channels.cache.get(memberClub.textChat).updateOverwrite(message.author.id, {SEND_MESSAGES: true, VIEW_CHANNEL: true});
            await message.guild.members.cache.get(collected.last().content).send(`${message.author} forced you to join ${memberClub.clubName}! What A Shame!`);
        });
    
});
};