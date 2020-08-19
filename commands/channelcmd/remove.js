exports.removeChannel = async (client, message, args, tagged) => {
  const fs = require("fs");

  message.delete({ timeout: 200 });
  let parsedRole = args[2].replace('<@&', '').replace('>', "");
message.guild.channels.cache().has(args[1]);
	if(!message.guild.channels.cache().has(args[1])) return message.channel.send("No Channel Found!");
  message.guild.channels.cache().find(args[1]).delete();
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
            name: `Channel Deleted!`,
            value: `<@#${args[1]}>`
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