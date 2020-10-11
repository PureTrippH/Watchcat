exports.run = async (client, message, args) => {
  const Discord = require('discord.js');
  const fs = require("fs");
  const type = require("../data/commandTypes"); 
  const broadHelp = new Discord.MessageEmbed();
  broadHelp.setColor('#e0a5e6');
  broadHelp.setAuthor(client.user.username, client.user.avatarURL());
  broadHelp.setThumbnail(client.user.avatarURL());

//Maybe a better function? Not quite sure. Thought of Javascript Object but they are already in Commands

    
    if(!args[0]) {
      
      (type.cmdTypes.types).forEach(key =>{
           broadHelp.addFields(
          { name: `${key}`, value: `!!help ${key}`, inline: true }
        )
      })
      message.author.send({embed: broadHelp});

      return;
    }


    const cmd = client.commands.get(args[0].toLowerCase());
      
      if(client.commands.has(args[0])) {
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
      } else if ((type.cmdTypes.types).includes(args[0].toLowerCase())) {
        (client.commands).forEach(command => {
          console.log();
          if(command.help.type == args[0].toLowerCase()) broadHelp.addFields(
            { name: `Name: ${command.help.name}`, value: `Usage: ${command.help.desc}`, inline: true },
          )
        });
        message.author.send({embed: broadHelp});
      } else message.channel.send("Could Not Find Command Type or Command");


    if(!client.commands.has(args[0])) return 
        
        return;
};

module.exports.help = {
  name: "Help",
  type: "user",
  aliases: [],
	desc: "This shows how to use commands and what they are",
	usage: "l^help {command}"
}