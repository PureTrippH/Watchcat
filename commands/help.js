exports.run = async (client, message, args) => {
  const Discord = require('discord.js');

    const fs = require("fs");
    message.delete();
    console.log(client.commands.has(args[0]));
    if(!args[0]) {
      const cmd = client.commands
      const broadHelp = new Discord.MessageEmbed();
      broadHelp.setColor('#e0a5e6');
      cmd.forEach(key =>{
        broadHelp.addFields(
          { name: `${key.help.name}`, value: `${key.help.desc}`, inline: false }
        )
      })
      message.author.send({embed: broadHelp});
    }
    if(!client.commands.has(args[0])) return message.channel.send("Commands Entered not a command!");
        const cmd = client.commands.get(args[0].toLowerCase());
        message.author.send({embed: {
            color: 0xd681d2,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: `Help Command:`,
            timestamp: new Date(),
            fields: [
                {
                    name: cmd.help.name,
                    value: cmd.help.desc
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

module.exports.help = {
	name: "Help",
	desc: "This shows how to use commands and what they are",
	usage: "l^help {command}"
}