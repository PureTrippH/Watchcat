//Most Likely should Optimize this Spaghetti Code.
exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const instructionEmbed = new Discord.MessageEmbed();
    let fields = [];
    const exampleEmbed = new Discord.MessageEmbed();
    const filter = m => m.author.id === message.author.id;

    instructionEmbed.setTitle("Embed Creator!");

    if(message.member.hasPermission('ADMINISTRATOR') || message.author.id == '168695206575734784') {
    message.delete();
    message.channel.send("Embed Header Amount (If You Dont Want Headers, Set 0 and Use Desc. Instead!):");
    message.channel.awaitMessages(filter, {
      max: 1
    }).then(collectedtext => {
    message.channel.send("Enter a Color (Note: Enter the Hex Value!):");
    message.channel.awaitMessages(filter, {
      max: 1
    }).then(color => {
      exampleEmbed.setColor('#' + color.first().content);
      
      
    message.channel.send("Will this Embed have an image?").then(msg => {
      msg.react('✅');
      msg.react('❌');
      
      msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
      { max: 1, time: 50000 }).then(collected => {
        const reaction = collected.first().emoji.name;
      console.log(reaction);
      if(collected.first().emoji.name == '✅') {
        func(client, message, args, collectedtext, filter, fields, color, exampleEmbed, true);
      } else return func(client, message, args, collectedtext, filter, fields, color, exampleEmbed, false);
      });
    })
    
    });
  });
}
}

module.exports.help = {
  name: "Embed",
  type: "utility",
  aliases: [],
	desc: "Opens the Embed Editor to create Discord Embeds",
	usage: "!!embed [channel] [id]"
}


const func = async(client, message, args, collectedtext, filter, fields, color, embedTar, hasImage) => {
  if(isNaN(parseInt(collectedtext.first().content))) return message.author.send("Error! Number Specified was Not a Number!");
for(let i = 0; i < parseInt(collectedtext.first().content); i++) {
  await new Promise((res) => {
    message.channel.send("First Message: Header Text");
    message.channel.send("Second Message: First: Header Text");
    message.channel.awaitMessages(filter, {
      max: 2
    }).then(contents => {
      let header = contents.first().content;
      let body = contents.last().content;
      embedTar.addFields(
        { name: `${header}`, value: `${body}`, inline: false }
      )
      res();
    });
      
    });
  }


  message.channel.send("Title: React with ✅ to Set a Title").then(msg => {
    msg.react('✅');
    msg.react('❌');
    
    msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
    { max: 1, time: 50000 }).then(emojiCollec => {
    const reaction = emojiCollec.first().emoji.name;
    console.log(reaction);
    if(emojiCollec.first().emoji.name == '✅') {
      message.channel.send("Insert a Title:");
      message.channel.awaitMessages(filter, {
        max: 1
      }).then(title => {
        embedTar.setTitle(title.first().content);
        wantDesc(client, message, args, collectedtext, filter, fields, color, embedTar, hasImage);
      });
    } else {
      wantDesc(client, message, args, collectedtext, filter, fields, color, embedTar, hasImage);
    }
    });
  })

const wantDesc = (client, message, args, collectedtext, filter, fields, color, embedTar, hasImage) => {
    message.channel.send("Description: Will There Be One Present?").then(msg => {
      msg.react('✅');
      msg.react('❌');
      
      msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
      { max: 1, time: 50000 }).then(emojiCollec1 => {
      const reaction = emojiCollec1.first().emoji.name;
      console.log(reaction);
      if(emojiCollec1.first().emoji.name == '✅') {
        message.channel.send("Insert a Description:");
        message.channel.awaitMessages(filter, {
          max: 1
        }).then(desc => {
          embedTar.setDescription(desc.first().content);
          hasImageCheck(client, message, args, collectedtext, filter, fields, color, embedTar, hasImage);
        });
      } else {
        hasImageCheck(client, message, args, collectedtext, filter, fields, color, embedTar, hasImage);
      }
      });
    })
  }
    

const hasImageCheck = (client, message, args, collectedtext, filter, fields, color, embedTar, hasImage) => {
  let parsedChannel = args[0].replace('<#', '').replace('>', "");
  console.log(parsedChannel);
  const channelRecipient = ((args[0] == null)) ? message.channel : message.guild.channels.cache.get(parsedChannel);
  if(hasImage == true) {
    message.channel.send("Image Selected: Type the image link:")
    message.channel.awaitMessages(filter, {
      max: 1
    }).then(image => {
      embedTar.setImage(image.first().content);
      if(!(args[0] == null) && !(args[1] == null)) {
        channelRecipient.messages.fetch(args[1]).then(msg => {
          msg.edit(embedTar);
        });
        return;
      }

      
      channelRecipient.send(embedTar);
      return;
    });
  } else {
    console.log(!(args[0] == null) && !(args[1] == null));
    if(!(args[0] == null) && !(args[1] == null)) {
      channelRecipient.messages.fetch(args[1]).then(msg => {
        msg.edit(embedTar);
      });
      return;
    }
    channelRecipient.send(embedTar);
  }
}
}


