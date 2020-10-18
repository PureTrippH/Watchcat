const { Message } = require("discord.js");
const redis = require("../utils/redis");

module.exports = async (client, reaction) => {

  const redisClient = await redis()
  const redisKey = `poll-${reaction.message.id}`

  redisClient.get(redisKey, (err, result) => {
    console.log(result);
    if(result) {
      const Discord = require('discord.js');
      const channel = reaction.message.channel;
      redisClient.quit();

      const oldEmb = reaction.message.embeds[0];
      const oldEmbForm = new Discord.MessageEmbed(oldEmb);
      const reactionInfo = reaction.message.reactions.cache.array();

      let countX = 0;
      let countCheck = 0;

      //Check 766801202297045002
      //X 767067602144854046
      reaction.message.reactions.cache.forEach(emoji => {
        switch(emoji.emoji.id) {
          case '766801202297045002':
            countCheck = emoji.count;
          break;
          case '766801174543728660':
            countX = emoji.count;
          break; 
        }
      });


      console.log(countCheck + countX);
      const poll = channel.messages.cache.get(reaction.message.id);
        oldEmbForm.fields = [];
        oldEmbForm.addFields({ name: `Positive:`, value: getAverages(countCheck/(countCheck + countX), "pos").join(""), inline: true }, { name: `Negative:`, value: getAverages(countX/(countCheck + countX), "neg").join(""), inline: true });
        poll.edit(oldEmbForm);
    }
  });
};


const getAverages = (num, posneg) => {
  let arr = new Array(10);

  roundedNum = Math.round(num*10);

  console.log(`DEBUG: ${roundedNum} Pos or Neg: ${posneg}`);

  for(let it = 0 ; it < 10 ; it++) {
    switch(posneg) {
      case 'pos':
        (roundedNum <= it) ? arr[it] = ('⬛') : arr[it] = ('🟩')
        
      break;
      case 'neg':
        (roundedNum <= it) ? arr[it] = ('⬛') : arr[it] = ('🟥')
      break;
      
    }
  }
  return arr
}