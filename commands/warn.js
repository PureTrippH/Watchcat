exports.run = async (client, message, args) => {
    const serverSettings = require("../data/serversettings.json");
    const reason = args.slice(1).join(" ") || "Unknown Reason";
    const fs = require("fs");
    const tagged = message.mentions.users.first();
    if(message.member.hasPermission('KICK_MEMBERS') || message.author.id == '168695206575734784') {
    if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tempban");
    message.delete({ timeout: 200 });
        tagged.send({embed: {
            color: 0xeba134,
            author: {
              name: message.author.username,
              icon_url: client.user.avatarURL
            },
            title: `Laela's Watchdog's`,
            timestamp: new Date(),
            description: `This Citation was created by: ${message.author}`,
            fields: [
              {
                name: 'Citation on:',
                value: message.guild.name
              },
                {
                    name: 'Warning:',
                    value: reason
                }
            ],
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username
            },
          }
        });
        return;
};

}

module.exports.help = {
	name: "Warn",
	desc: "Sends a user a DM warning them of an offense, but doesn't add a tier",
	usage: "l^warn (user) [reason]"
}