exports.run = async (client) => {
  const mongoose = require('mongoose');
	const serverConfig = require("../../utils/schemas/serverconfig.js");
  const serverStats = require("../../utils/schemas/serverstat.js");
  
  const serverData = await serverStats.findOne({
    guildId: "732237195355750441"
  });
  (function sendEgg() {
    let seconds = ((Math.floor(Math.random() * 10) + 1)*1000);
    let randomIndex = ((Math.floor(Math.random() * 2) + 1));
    const channelArray = ["732237195980701820", "739315803765342249"];
    setTimeout(function() {
      let randomChannel = client.channels.cache.get(channelArray[randomIndex - 1]);
      randomChannel.send("🐓").then(msg => {
        msg.react("🥚");
        
        msg.awaitReactions((reaction, user) => (user.id != "728702221096845352") && (reaction.emoji.name == '🥚'),
	    { 
      max: 1, 
      }).then(collected => {
        console.log(collected.first().users);
        randomChannel.send(`${collected.first().author} got the egg!`);
        serverData.findOneAndUpdate({
          guildId: msg.guild.id, 
				"guildMembers.userID": tagged.id,
        }, 
        {
          $inc:{
            "guildMembers.$.eggCount":1
          },
        },
        {
          "arrayFilters": [
            { "guildMembers.userID": dbResConfig.serverTiers[tierIndex].TierName }
          ]
        }).exec();



      });
    });
      sendEgg();
    }, seconds);
}());
   
};