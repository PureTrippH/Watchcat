exports.run = async (client, message, args) => {
  const Discord = require("discord.js");
  const embed = new Discord.MessageEmbed();
  const queries = require('../utils/queries/queries');
  const server = await queries.queryServerConfig(message.guild.id);

  message.delete({ timeout: 10});
  if(!server) {
    embed.setTitle(`ERROR:`);
    embed.setDescription(`The Server Admins have NOT set the channel OR the Role for verification. Please DM an Admin for info!`);
    embed.setColor('#ff0000');
    embed.setFooter(new Date());
    message.author.send(embed);
    return;
  }
  if(!message.member.roles.cache.has(server.removedRole)) return message.author.send("You have already verified yourself. Dont try.");
      message.member.roles.remove(server.removedRole);
      embed.setTitle(`You Have Been Verified!:`);
      embed.setDescription(`You are now verified on ${message.guild.name}! Enjoy the chat`);
      embed.setColor('#00ff00');
      embed.setFooter(new Date());
      message.author.send(embed).then(() => {
        try{
          embed.setTitle(`USER VERIFIED: ${message.guild.member(message.author).displayName}`);
          embed.setColor(`#RANDOM`);
          embed.setDescription(`User Verified: ${message.author}`);
          embed.setFooter(new Date());
          client.channels.cache.get(server.logChannel).send(embed);
        } catch {
          console.log("ERROR: NO LOG CHANNEL SPECIFIED");
        }
      });
  };

module.exports.help = {
  name: "Verify",
  aliases: ["v"],
  type: "user",
	desc: "Verifies a User on the Server and removes Their Restricted Role (Defined in Config)",
	usage: "!!verify"
}