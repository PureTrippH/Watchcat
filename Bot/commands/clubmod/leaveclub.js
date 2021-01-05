exports.leaveClub = async (client, message) => { 
    
const filter = m => m.author.id === message.author.id;
message.channel.send("Please Enter The Club Name:");
message.channel.awaitMessages(filter, {max:1}).then(async collected => {
    const clubSchema = require("../../utils/schemas/club");

    let clubInfo = await clubSchema.findOne({
        guildId: message.guild.id,
        clubName: (collected.first().content).toLowerCase()
    });    

	let memberClub = await clubSchema.findOneAndUpdate({
            guildId: message.guild.id,
            clubName: (collected.first().content).toLowerCase()
		}, {
            $pull: {
                members: message.author.id
            }
        }).then( ()=> {
            message.guild.channels.cache.get(clubInfo.textChat).updateOverwrite(message.author.id, {SEND_MESSAGES: false, VIEW_CHANNEL: false});
            message.author.send("Successfully Left Club");
        });
    
    console.log(memberClub);
    
});
};