exports.run = async (client, message, args) => {
    const serverSettings = require("../data/serversettings.json");
    const channel = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].channel;
    const role = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].role;
    const fs = require("fs");
    message.delete();
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
                    name: 'Badger',
                    value: 'badger badger badger badger badger badger badger badger badger badger badger badger'
                }
            ],
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/en/0/04/Badgers_Badgers.gif',
            },
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username
            },
          }
        });
        return;
};

module.exports.help = {
	name: "Nothing To See Here",
	desc: "This is Hidden. Dont Run it!",
	usage: "l^badger"
}