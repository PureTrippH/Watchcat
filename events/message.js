module.exports = (client, message) => {
	  const serverSettings = require("../data/serversettings.json");
    const channel = (!serverSettings[message.author.guild]) ? null : serverSettings[message.author.guild].channel;
    if(message.channel == channel) {
      message.delete();
    }
    if(message.author.bot) return;
    if(message.content.indexOf(client.prefix) !== 0) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g); 
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
  };