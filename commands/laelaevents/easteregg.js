exports.run = async (client) => {

  (function sendEgg() {
    let seconds = ((Math.floor(Math.random() * 10) + 1)*1000);
    let randomIndex = ((Math.floor(Math.random() * 2) + 1));
    const channelArray = ["732237195980701820", "739315803765342249"];
    
    setTimeout(function() {
      let logChannel = client.channels.cache.get(channelArray[randomIndex - 1]);
      logChannel.send("🐓").then(msg => {
        msg.react("🥚");
        
        msg.awaitReactions((reaction, user) => (user.id == message.author.id) && (reaction.emoji.name == '🥚'),
	    { 
      max: 1, 
      time: 50000 
      }).then(collected => {
        logChannel.send("He got the egg!");
      });
    });
      sendEgg();
    }, seconds);
}());
   
}