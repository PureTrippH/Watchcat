exports.run = async (client, message, args) => {
    const serverSettings = require("../data/serversettings.json");
    const channel = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].channel;
    const role = (!serverSettings[message.guild.id]) ? null : serverSettings[message.guild.id].role;
    const fs = require("fs");
    message.delete

    const catphoto = await fetch
};

