exports.run = async (client, message, args) => {
  const serverSettings = require("../data/serversettings.json");
  const reason = args.slice(1).join(" ") || "Unknown Reason";
  const fs = require("fs");
  const Discord = require("discord.js");
  const embed = new Discord.MessageEmbed();
  const action = new Discord.MessageEmbed();
  const tagged = message.mentions.users.first();
  if(!(message.member.hasPermission('BAN_MEMBERS'))) return message.author.send('You do not have access to the mod panel');
  message.delete({ timeout: 200 });
  embed.setTitle("Mod Panel");
  embed.setColor("#56315e");
  embed.addFields(
    { name: `Freeze Chat - 1️⃣`, value: `Freezes The Current Chat`, inline: false },
    { name: `Thaw Chat - 2️⃣`, value: `Allows People To Speak Again`, inline: false }
  )
message.channel.send(embed).then(msg =>{
  msg.react('1️⃣');
  msg.react('2️⃣');
  msg.awaitReactions((reaction, user) => user.id == message.author.id, {
    max: 1,
    time: 25000
  }).then(reaction => {
    const reactionName = reaction.first().emoji.name;
    switch(reactionName) {
      case '1️⃣':
        message.channel.updateOverwrite(message.channel.guild.roles.everyone, {SEND_MESSAGES: false});
        action.setTitle(`Freezing Channel`);
        action.setImage("https://media1.tenor.com/images/986a8d2cb28d13f72cdab7649b9475e4/tenor.gif?itemid=18636464");
        message.channel.send(action);
      break;

      case '2️⃣':
        message.channel.updateOverwrite(message.channel.guild.roles.everyone, {SEND_MESSAGES: null});
        action.setTitle(`Thawing Channel`);
        action.setImage("https://media1.giphy.com/media/WTpPuEnlEZIAImjtJK/giphy.gif");
        message.channel.send(action);
      break;
      case '3️⃣':
        
      break;
    }
  });
})
return;
};

module.exports.help = {
  name: "Mod",
  type: "moderation",
  aliases: [],
	desc: "Opens the mod panel. In the mod panel, you are able to freeze and thaw the chat. By freezing a chat, you are making it so only mods and other admins can chat in the channel. This can help with locking verification or calming chat down if they get too dramatic",
	usage: "!!mod",
  gif:"https://cdn.discordapp.com/attachments/812822011227275354/812822537755033630/2021-02-20_18-04-43.gif"
}