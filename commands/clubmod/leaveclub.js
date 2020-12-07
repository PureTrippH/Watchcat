exports.leaveClub = async (client, message) => { 
    
const filter = m => m.author.id === message.author.id;
message.channel.send("Please Enter The Club Name:");
message.channel.awaitMessages(filter, {max:1}).then(async collected => {
    
    const clubSchema = require("../../utils/schemas/club");
	let memberClub = await clubSchema.findOneAndUpdate({
            guildId: message.guild.id,
            clubName: (collected.first().content).toLowerCase()
		}, {
            $pull: {
                members: message.author.id
            }
        }).then( ()=> {
            message.author.send("Successfully Left Club");
        });
    
    console.log(memberClub);
    
});
};