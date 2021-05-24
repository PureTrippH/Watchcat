exports.message = async (client, message, args) => {
  const Discord = require("discord.js");
  let embed = new Discord.MessageEmbed();
  embed.setTitle("Dev Announcement!");
  embed.setColor('#5b4394');
  embed.setDescription(`Written by ${message.author}`);
  embed.addFields({ name: `Announcement:`, value: `${args.slice(1).join(" ")}`});
  message.delete({ timeout: 200 })
  client.guilds.cache.each(guild => {
    try {
    guild.channels.cache.get(guild.systemChannel.id).send(embed);
    } catch(err) {
      console.log(err);
    }
  });
}