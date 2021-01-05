const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('./utils/mongoose');
const settings = require('./settings.json');
const queries = require("./utils/queries/queries.js");

const serverStats = require("./utils/schemas/serverstat");
const punishSchema = require("./utils/schemas/punishment");
const { RuleTester } = require('eslint');


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
    console.log("Hi");
    checkPunishments()


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


const checkPunishments = async() => {
    console.log("CHECKING DATA");
        const now = new Date();
        const cond = {
            expires: {
                $lt: now
            },
            stale: false
        }
    
        const punishments = await punishSchema.find(cond);
        if(punishments) {
            for(const result of punishments) {
                console.log("Looping");
                let selectedGuild = await client.guilds.cache.get(result.guildID);
                
                console.log(result.type);
                if(result.type == "mute") {
                    let selectedMember = await selectedGuild.members.fetch(result.userID);
                    let tierArg = result.tier;
                    const dbResConfig = await queries.queryServerConfig(selectedGuild.id);
                    let dbResStatsUpdate = await serverStats.findOne(
                        {
                        guildId: selectedGuild.id,
                        "guildMembers.userID": selectedMember.id
                        }, 
                        {
                        guildMembers: {
                                $elemMatch: 
                                {
                            userID: selectedMember.id,
                            },
                        }
                    });
                    
                    const index = dbResStatsUpdate.guildMembers[0].punishmentsTiers.findIndex(tierObj => tierObj.tierName === tierArg);
                    console.log(dbResStatsUpdate.guildMembers[0].punishmentsTiers);
                    await selectedMember.roles.remove(dbResConfig.mutedRole);
                    await selectedMember.roles.set(dbResStatsUpdate.guildMembers[0].punishmentsTiers[index].pastRoles);
                    console.log("Unmuted");
                } else {
                    try {
                        selectedGuild.members.unban(result.userID, {reason: "They have served their sentence"});
                    } catch (err) {console.log(`UNBAN ERROR: ${err}`);}
                }
            }
            await punishSchema.deleteMany(cond);
        }
        setTimeout(checkPunishments, 1000 * 180);
    }