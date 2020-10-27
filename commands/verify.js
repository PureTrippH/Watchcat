exports.run = async (client, message, args) => {
  const Discord = require("discord.js");
  const queries = require('../utils/queries/queries');
  const server = await queries.queryServerConfig(message.guild.id);

    message.delete({ timeout: 10});
    if(!server) {
        message.author.send({embed: {
            color: 0xff0000,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: `Laela's Watchdog's`,
            timestamp: new Date(),
            fields: [
                {
                    name: 'ERROR:',
                    value: "The Server Admins have NOT set the channel OR the Role for verification. Please DM an Admin for info!",
                    
                }
            ],
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username
            },
          }
        });
        return;
    }
    if(!message.member.roles.cache.has(server.removedRole)) return message.author.send("You have already verified yourself. Dont try.");
        message.member.roles.remove(server.removedRole);
        message.author.send({embed: {
            color: 0x00ff00,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: `Laela's Watchdog's`,
            timestamp: new Date(),
            fields: [
                {
                    name: 'Verified!',
                    value: "You are now verified on this server! Enjoy the chat",
                    
                }
            ],
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username
            },
          }
        });
    try{
      const embedVer = new Discord.MessageEmbed();
      embedVer.setTitle(`USER VERIFIED: ${message.author}`);
      embedVer.setDescription(`#00ff00`);
      embedVer.setFooter(new Date());
      client.channels.cache.get(server.logChannel).send(embedVer);
  } catch {
    console.log("ERROR: NO LOG CHANNEL SPECIFIED");
  }
};

module.exports.help = {
  name: "Verify",
  aliases: [],
  type: "user",
	desc: "Verifies a User on the Server and removes Their Restricted Role (Defined in Config)",
	usage: "l^verify"
}