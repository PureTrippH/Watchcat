exports.rolecmd = async (client, message, args, tagged) => {
  const fs = require("fs");

  message.delete({ timeout: 200 });
  let parsedRole = args[2].replace('<@&', '').replace('>', "");

	if(!message.guild.roles.cache.get(parsedRole)) return message.author.send("No Role Found!");
  if((tagged.roles.cache.has(parsedRole))) return message.author.send("User has role!");
  tagged.roles.add(parsedRole);
    message.channel.send({embed: {
          color: 0xa8e0af,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: `Laela's Watchdog's`,
          timestamp: new Date(),
          fields: [
              {
                  name: `Role Added To: ${tagged}`,
                  value: `<@&${parsedRole}>`
              }
          ],
          footer: {
            icon_url: client.user.avatarURL,
            text: client.user.username
          },
        }
      });

}
module.exports.help = {
name: "Mute",
desc: "Mutes a User for 10 minutes",
usage: "l^mute (tagged user) [optional reason]"
}