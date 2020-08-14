const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./settings.json');
const { stringify } = require('querystring');
const mongoose = require('./utils/mongoose');


const client = new Discord.Client();
client.prefix = prefix;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));



fs.readdir('./events', (err, files) => {
    if (err) return console.log(`Oopsie Woopsies Gem Found an Error: ${err}`);
    for(const eventFile of files) {
        const event = require(`./events/${eventFile}`);
        let eventName = eventFile.split(".")[0];
        client.on(eventName, event.bind(null, client));
    }

});

client.commands = new Discord.Collection();
client.once('ready', () => {
    console.log("Laela's Watchdog Ready to Guard");
});

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName.toLowerCase(), command);
    console.log(`Gem Bot has registered ${commandName}`)
});

mongoose.init();
client.login(process.env.BOT_TOKEN);

