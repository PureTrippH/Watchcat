exports.run = async (client) => {
  const mongoose = require('mongoose');
	const serverConfig = require("../../utils/schemas/serverconfig.js");
  const serverStats = require("../../utils/schemas/serverstat.js");
  

  (async function sendEgg() {

    let dbResStats = await serverStats.findOne({
      guildId: "709865844670201967"
    });

    let seconds = ((Math.floor(Math.random() * 120) + 20)*1000);
    let randomIndex = ((Math.floor(Math.random() * 7) + 1));
    const channelArray = ["709865845504868447", "724113716550828032", "723278430443143199", "709869018558759002", "709865845504868451", "726156971090247782", "746751326419025960"];
    setTimeout(function() {
      let randomChannel = client.channels.cache.get(channelArray[randomIndex - 1]);
      randomChannel.send("🐓").then(msg => {
        msg.react("🥚");
        console.log("An Egg Has Spawned");
        msg.awaitReactions((reaction, user) => (user.id != "735559543886446712") && (reaction.emoji.name == '🥚'),
	    { 
      max: 1, 
      }).then(collected => {
        msg.delete();
        let firstReaction = ([...collected.first().users.cache.keys()][1])
        randomChannel.send(`Egg Claimed!`).then(msg => {
          msg.delete({timeout: 1000});
        });
        serverStats.findOneAndUpdate({
          guildId: "709865844670201967", 
          "guildMembers.userID": firstReaction
        },
        {
          $inc:{
            "guildMembers.$.eggCount":1
          }
        },
         {upsert: true}).exec();
      });
    });
      sendEgg();
    }, seconds);
}());
   
};