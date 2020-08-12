exports.run = async (client, message, args) => {
    const serverSettings = require("../data/serversettings.json");
    const channel = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].channel;
    const role = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].role;
    const fs = require("fs");

    if(message.author.id == "700214206808719432") {
    message.delete({ timeout: 200 });
        message.author.send({embed: {
            color: 0xa8e0af,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: `Laela's Watchdog's`,
            timestamp: new Date(),
            fields: [
                {
                    name: 'Get Stickbugged lol',
                    value: 'https://www.youtube.com/watch?v=gPPKHt6hFCA'
                }
            ],
            image: {
              url: 'https://media.tenor.com/images/36dd82e085114a98fe9cfe428d7a4031/tenor.gif',
            },
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username
            },
          }
        });
        setTimeout(() => {
          try {
            message.channel.send("Min just got stickbugged lol");
          } catch(err) {console.log(err);}
        }, 7000);
        return;
};


}

module.exports.help = {
	name: "Mute",
	desc: "Mutes a User for 10 minutes",
	usage: "l^mute (tagged user) [optional reason]"
}