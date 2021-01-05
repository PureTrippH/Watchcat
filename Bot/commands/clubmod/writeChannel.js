exports.write = async (client, message, filter) => { 
message.channel.send("Please Enter The Club Name Then Channel ID:");
message.channel.awaitMessages(filter, {max:2}).then(async collected => {
    
    const clubSchema = require("../../utils/schemas/club");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.author.send("This Command is for Admins Only");
	await clubSchema.findOneAndUpdate({
            guildId: message.guild.id,
            clubName: (collected.first().content).toLowerCase()
        },
        {
            textChat: collected.last().content
        }   
        ).then(succ => {
            if(succ) {
                message.author.send("Successfully Assigned Club Channel");
            }
        });    
    });
};