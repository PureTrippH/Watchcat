exports.run = async (client) => {
  const mongoose = require('mongoose');
	const serverConfig = require("../../utils/schemas/serverconfig.js");
  const serverStats = require("../../utils/schemas/serverstat.js");
  

  (async function sendEgg() {

    let dbResStats = await serverStats.findOne({
      guildId: "709865844670201967"
    });

    let seconds = ((Math.floor(Math.random() * 600) + 300)*1000);
    let randomIndex = ((Math.floor(Math.random() * 2) + 1));
    const channelArray = ["709865845504868447", "724113716550828032", "726156971090247782", "723278430443143199", "709867435515183155", "709867478574039121", "709869018558759002"];
    setTimeout(function() {
      let randomChannel = client.channels.cache.get(channelArray[randomIndex - 1]);
      randomChannel.send("🐓").then(msg => {
        msg.react("🥚");
        
        msg.awaitReactions((reaction, user) => (user.id != "728702221096845352") && (reaction.emoji.name == '🥚'),
	    { 
      max: 1, 
      }).then(collected => {
        msg.delete();
        let firstReaction = ([...collected.first().users.cache.keys()][1])
        randomChannel.send(`${client.guilds.cache.get("709865844670201967").member(firstReaction).displayName} got the egg!`).then(msg => {
          msg.delete({timeout: 1000});
        });
        serverStats.findOneAndUpdate({
          guildId: "709865844670201967", 
          "guildMembers.userID": firstReaction
        },
        {
          $inc:{
            "guildMembers.$.eggCount":10000
          }
        },
         {upsert: true}).exec();



      });
    });
      sendEgg();
    }, seconds);
}());
   
};