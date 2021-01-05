exports.joinClub = async (client, message, filter) => { 
message.channel.send("Please Enter The Club Name:");
message.channel.awaitMessages(filter, {max:1}).then(async collected => {
    
    const clubSchema = require("../../utils/schemas/club");
	let memberClub = await clubSchema.findOne({
            guildId: message.guild.id,
            clubName: (collected.first().content).toLowerCase()
        });
        if(!memberClub) return message.author.send("Club Does Not Exist");

        memberClub.updateOne({
            $push: {
                members: message.author.id
            }
        }).then(() => {
            console.log(message.guild.channels.cache.get(memberClub.textChat));
            message.guild.channels.cache.get(memberClub.textChat).updateOverwrite(message.author.id, {SEND_MESSAGES: true, VIEW_CHANNEL: true});
            message.author.send("Successfully Joined Club");
        });
    console.log(memberClub);
    
});
};