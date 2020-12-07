exports.joinClub = async (client, message, filter) => { 
message.channel.send("Please Enter The Club Name:");
message.channel.awaitMessages(filter, {max:1}).then(async collected => {
    
    const clubSchema = require("../../utils/schemas/club");
	let memberClub = await clubSchema.findOne({
            guildId: message.guild.id,
            clubName: (collected.first().content).toLowerCase()
        });
        if((memberClub.members).includes(message.author.id)) return message.author.send("Cant Join this Club. You Are Already A MEMEber!");
        memberClub.updateOne({
            $push: {
                members: message.author.id
            }
        });
    console.log(memberClub);
    message.author.send("Successfully Joined Club");
});
};