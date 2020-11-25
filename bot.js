const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('./utils/mongoose');
const settings = require('./settings.json');
const redis = require('./utils/redis');
const queries = require("./utils/queries/queries.js");


const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
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
client.aliases = new Discord.Collection();
client.once('ready', async() => {
    const guildCount = await client.shard.fetchClientValues('guilds.cache.size');
    console.log("Laela's Watchcat Ready to Guard");
    client.user.setPresence({ activity: { name: `Watching: ${guildCount} Servers!! Ty!` }, status: 'idle' });
    //eggHunt.run(client);

});

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName.toLowerCase(), command);
    command.help.aliases.forEach(alias => {
        console.log(`Watchcat Registering ${alias}`);
        client.aliases.set(alias, command);
    })
    console.log(`Watchcat has registered ${commandName}`);
});

mongoose.init();
client.login(settings.token);


redis.expire(async remessage => {
    
    if(remessage.startsWith(`muted-`)) {
        let str = remessage.split('-');
        console.log("1 Time: " + remessage);
        let selectedGuild = client.guilds.cache.get(str[2]);
        let selectedMember = selectedGuild.members.cache.get(str[1]);
        let tierArg = str[3];
        const dbResConfig = await queries.queryServerConfig(selectedGuild.id);
        let dbResStatsUpdate = queries.queryUser(selectedGuild, selectedMember);
        const mentionedTier = (dbResStatsUpdate.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg) == -1) ? 0 : dbResStatsUpdate.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg); 
        const arrayVal = ((typeof dbResStatsUpdate.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles.arrayOfRoles) == 'undefined') ? dbResStatsUpdate.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles : dbResStatsUpdate.guildMembers[0].punishmentsTiers[mentionedTier].pastRoles.arrayOfRoles
        selectedMember.roles.remove(dbResConfig.mutedRole);
        selectedMember.roles.set(arrayVal);
        selectedMember.send({embed: {
            color: 0xff0000,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            description: `Tier Expired`,
            title: `User: ${selectedGuild.member(selectedMember.id).displayName}`,
            timestamp: new Date(),
            fields: [
                {
                    name: `Mute Expired!`,
                    value: `If you arent unmuted or your roles are not back, please use (serverprefix)ticket (message)`,
                },
                ],
            footer: {
                icon_url: client.user.avatarURL,
                text: client.user.username
            },
            }
        })
    } else if(remessage.startsWith('banned-')) {
        let str = remessage.split('-');
        let selectedGuild = client.guilds.cache.get(str[2]);
        let selectedMember = selectedGuild.members.cache.get(str[1]);
        try {
            selectedGuild.members.unban(selectedMember, {reason: "They have served their sentence"});
        } catch (err) {console.log(`ERROR: ${err}`);}
    }
});