module.exports = (client, message) => {
	  const serverSettings = require("../data/serversettings.json");
    const channel = (!serverSettings[message.author.guild]) ? null : serverSettings[message.author.guild].channel;
    if(message.channel == channel) {
      message.delete();
    }
    if(message.author.bot) return;
    if(message.author.id == '279763343017771010') {
      let ruby = guild.member(message.author);
      message.delete
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
                name: ruby ? ruby.displayname : null,
                value: message,
                
            }
        ],
        footer: {
          icon_url: ruby.avatarURL,
          text: ruby.username
        },
      }
    });
    }
    if(message.content.indexOf(client.prefix) !== 0) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g); 
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
  };