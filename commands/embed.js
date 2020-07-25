exports.run = async (client, message, args) => {
    let fields = [];
    let title = (args[0] == null) ? args[0] : "Titleless"
    const filter = m => m.author.id === message.author.id;
    message.delete();
    message.channel.send("Embed Header Amount:");
    message.channel.awaitMessages(filter, {
      max: 1
    }).then(collectedtext => {
      message.delete();
      message.channel.send("Enter a Color (Note: Enter the Hex Value!):");
      message.channel.awaitMessages(filter, {
        max: 1
      }).then(color => {
        message.delete();
        func(client, message, args, collectedtext, filter, fields, color);
      });
  });
};


const func = async(client, message, args, collectedtext, filter, fields, color) => {
  if(isNaN(parseInt(collectedtext.first().content))) return message.author.send("Error! Number Specified was Not a Number!");
for (i = 0; i < parseInt(collectedtext.first().content); i++) {
  await new Promise((res, rej) => {
    message.channel.send("First Message: Header Text");
    message.channel.send("Second Message: First: Header Text");
    message.channel.awaitMessages(filter, {
      max: 2
    }).then(collectedtext => {
      let fieldObj = {
        name: collectedtext.first().content,
        value: collectedtext.last().content
      }
      fields.push(fieldObj)
      message.author.send({embed: {
        color: "0x" + color,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: `Laela's Watchdog's`,
        timestamp: new Date(),
        fields: fields,
        footer: {
          icon_url: client.user.avatarURL,
          text: client.user.username
        },
      }
    }).then(msg => {
      msg.react('✅');
		  msg.react('❌');
      msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '❌' || reaction.emoji.name == '✅'),
      { max: 1, time: 50000 }).then(collected => {;
        if(collected.first().emoji.name == '✅') {
          message.channel.send({embed: {
            color: "0x" + color,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: `Laela's Watchdog's`,
            timestamp: new Date(),
            fields: fields,
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username
            },
          }
        }); 
        }
      });
      });
      res();
    });
  });
}

}
