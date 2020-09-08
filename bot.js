const fs = require('fs');
const Discord = require('discord.js');
const { stringify } = require('querystring');
const mongoose = require('./utils/mongoose');
const eggHunt = require("./commands/laelaevents/easteregg.js");
const settings = require('./settings.json');


const client = new Discord.Client();
client.prefix = settings.prefix;
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
    airLineCount(client);
    //eggHunt.run(client);

});

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName.toLowerCase(), command);
    console.log(`Gem Bot has registered ${commandName}`)
});

mongoose.init();
client.login(settings.token);

const airLineCount = async(client) => {
    const serverStats = require("./utils/schemas/serverstat.js");
    const user = await serverStats.findOne(
		{
		   guildId: "709865844670201967",
		  "guildMembers.userID": "700214206808719432"
	  }, 
		{
		  guildMembers: {
			$elemMatch: 
			{
			  userID: "700214206808719432"
            }}});
        console.log(user.guildMembers);
        if((typeof user.guildMembers[0].AirLine) == 'undefined') {
            client.user.setPresence({ activity: { name: `Min Airline Food Count: 0` }, status: 'idle' });
        } else {
            client.user.setPresence({ activity: { name: `Min Airline Food Count: ${user.guildMembers[0].AirLine}` }, status: 'idle' });
        }
}
