exports.run = async (client) => {
  const mongoose = require('mongoose');
	const serverConfig = require("../../utils/schemas/serverconfig.js");
  const serverStats = require("../../utils/schemas/serverstat.js");
  

  (async function sendEgg() {

    let dbResStats = await serverStats.findOne({
      guildId: "709865844670201967"
    });

    let seconds = ((Math.floor(Math.random() * 10) + 1)*1000);
    let randomIndex = ((Math.floor(Math.random() * 2) + 1));
    const channelArray = ["727955931551498351", "727955931551498351"];
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