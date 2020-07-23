exports.run = async (client, message, args) => {
    const serverSettings = require("../data/serversettings.json");
    const channel = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].channel;
    const role = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].role;
    const fs = require("fs");

    message.author.send("This is a test command pls help me God");
    message.delete();
    if(!channel && !role) {
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
                    value: "The Server Admins have NOT set the channel OR the Role for verification. Please DM and Admin for info!",
                    
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
    if(message.channel != serverSettings[message.guild.id].channel) {
        message.channel.send("You have already verified yourself. Dont try.");
    } else {
        message.member.roles.remove(serverSettings[message.guild.id].role);
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
    }
};

