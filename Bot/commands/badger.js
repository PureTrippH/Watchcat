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
  name: "Badger",
  type: "fun",
  aliases: [],
	desc: `You know that song from Mr Weebl? Yes... this one... https://www.youtube.com/watch?v=EIyixC9NsLI&ab_channel=Weebl%27sStuff .... 
  Well I made it into a command as my first command outside of the verification system. It sends the Badgers video in your DMS`,
	usage: "!!badger",
  gif: "https://cdn.discordapp.com/attachments/812829546893541407/812829739462426634/2021-02-20_18-34-28.gif"
}