const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('./utils/mongoose');
const settings = require('./settings.json');
const queries = require("./utils/queries/queries.js");
const express = require("express");
const playQueue = require('./commands/play');

const eggHunt = require('./commands/laelaevents/easteregg');
const serverStats = require("./utils/schemas/serverstat");
const pollSchema = require("./utils/schemas/poll");
const punishSchema = require("./utils/schemas/punishment");

const app = express();

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
    console.log("Watchcat Ready to Guard");
    client.user.setPresence({ activity: { name: `Now On ${guildCount} Servers! TY!`, type:"STREAMING", url:"https://www.twitch.tv/fextralife" }});
    console.log("Hi");
    checkPunishments()


});

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName.toLowerCase(), command);
    command.help.aliases.forEach(alias => {
        client.aliases.set(alias, command);
    })
});

mongoose.init();
client.login(settings.token);



//API Routes///////////////////////////////////////////////////
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send(Array.from(client.commands, ([name, value]) => ({ name, value })));
})

app.listen(3016, () => console.log("Bot Command API Open"));

///////////////////////////////////////////////////////////////


//Check Tiers
const checkPunishments = async() => {
        const now = new Date();
        const cond = {
            expires: {
                $lt: now
            },
            stale: false
        }
        const pollRes = await pollSchema.find({
            endDate: {
                $lt: now
            },
        });
        console.log(pollRes);
        const punishments = await punishSchema.find(cond);
        if(punishments) {
            for(const result of punishments) {
                console.log("Checking Punishments");
                let selectedGuild = await client.guilds.cache.get(result.guildID);
                
                console.log(result.type);
                if(result.type == "mute") {
                    try {
                    let selectedMember = await selectedGuild.members.fetch(result.userID);
                    if(!selectedMember) return setTimeout(checkPunishments, 1000 * 30);
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
                    try {
                    await selectedMember.roles.set(dbResStatsUpdate.guildMembers[0].punishmentsTiers[index].pastRoles);
                    } catch {
                        console.log(`User has no Past Roles`);
                    }
                    console.log("Unmuted");
                } catch (err) {
                    console.log(`Error! Bot Caught Error While Unmuting: ${err}` );
                    
                }
                } else if(result.type == "ban") {
                    let selectedGuild = await client.guilds.cache.get(result.guildID);
                    try {
                        selectedGuild.members.unban(result.userID, {reason: "They have served their sentence"});
                    } catch (err) {console.log("Hey There: " + selectedGuild); console.log(`UNBAN ERROR: ${err}`);}
                } else {
                    
                }
            }
            await punishSchema.deleteMany(cond);
        }
        if(pollRes) {
            for(const res of pollRes) {
                console.log("new res");
                let channel = await client.channels.fetch(res.channel);
                let message = await channel.messages.fetch(res.message);
                    if(res.type == 'skippoll') {
                        let countCheck = 0;
                        let countX = 0;
                        message.reactions.cache.forEach(async emoji => {
                            switch(emoji.emoji.id) {
                              case '767083818199810088':
                                countCheck = emoji.count-1;
                              break;
                              case '767083772440608778':
                                countX = emoji.count-1;
                              break; 
                            }
                        if(countCheck/(countCheck+countX) > 0.6 && playQueue.getQueue().get(message.guild.id)) {
                            playQueue.getQueue().get(message.guild.id).connection.dispatcher.end();
                            client.channels.cache.get(res.channel).send("Vote Passed! Skipping Queue");

                        }
                        res.delete();
                    })
                }
            }
        }
        return setTimeout(checkPunishments, 1000 * 30);
    }