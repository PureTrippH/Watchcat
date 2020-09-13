exports.run = async (client, message, args) => {
    const fs = require("fs");
    message.delete({ timeout: 200 });
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
  type: "fun",
	desc: "This is Hidden. Dont Run it!",
	usage: "l^badger"
}