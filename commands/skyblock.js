exports.run = async (client, message, args) => {
    const profile = (parseInt(args[1])-1);


    const fetch = require("node-fetch");
    const ifUndefined = (val) => {
        if(!val) {
            return 0;
        } else{
            return val;
        }
    }

    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
    try {
        const myJson =  JSON.parse(await response.text());
        const hypixeldata = await fetch(`https://api.hypixel.net/player?uuid=${myJson.id}&key=520ab812-63d8-4fa0-b1b4-ddb56de4b220`);
        const playerIds = await hypixeldata.json();
        
        const skyblockdata = await fetch(`https://api.hypixel.net/Skyblock/profiles?key=520ab812-63d8-4fa0-b1b4-ddb56de4b220&uuid=${myJson.id}`);
        const skyData = await skyblockdata.json();


        await Promise.all([hypixeldata, playerIds, skyblockdata,skyData, response])
        const profileList = Object.keys(playerIds.player.stats.SkyBlock.profiles);

                console.log("It works... AFTER A DAY FINALLY!");

                message.channel.send({embed: {
                    color: 0x361c4f,
                    thumbnail: {
                        url: `https://minotar.net/helm/${myJson.id}`,
                    },
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL
                    },
                    title: `${myJson.name}'s Hypixel Skyblock Statistics :${skyData.profiles[profile].cute_name.toLowerCase()}:`,
                    timestamp: new Date(),
                    fields: [
                        {
                            name: 'Coins In Purse :moneybag:',
                            value: ifUndefined(Math.trunc(skyData.profiles[profile].members[myJson.id].coin_purse))
                        },
                        {
                            name: 'Fairy Souls :woman_fairy:',
                            value: ifUndefined(skyData.profiles[profile].members[myJson.id].fairy_souls_collected)
                        },
                        {
                            name: 'Zealot Kills',
                            value: ifUndefined(skyData.profiles[profile].members[myJson.id].stats.kills_zealot_enderman)
                        },
                        {
                            name: 'Death Count :skull:',
                            value: ifUndefined(skyData.profiles[profile].members[myJson.id].death_count)
                        },
                    ],
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: client.user.username
                    },
                  }
                });

    } catch(err) {


        message.channel.send({embed: {
            color: 0x361c4f,
            thumbnail: {
                url: `https://pm1.narvii.com/6450/0e4c227036c161b9add8b5e9225ee7a31d5b5861_hq.jpg`,
            },
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: `${args[0]}'s Account Does not Exist or Has Not Joined Skyblock!`,
            timestamp: new Date(),
            fields: [
                {
                    name: 'Contact If You Believe Its An error',
                    value: 'PureGem#0524'
                }
            ],
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username
            },
          }
        });

        console.log(err);
        return;
    }


    

}


module.exports.help = {
	name: "Skyblock",
	desc: "View a Minecraft Players Hypixel Skyblock Statistics",
	usage: "l^Skyblock (MC Username), (Profile #)"
}