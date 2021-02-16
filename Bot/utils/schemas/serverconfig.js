const mongoose = require("mongoose");
const configSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    removedRole: String,
    verChannel: String,
    prefix: String,
    newUserEnabled: String,
    newUserRole: String,
    mutedRole: String,
    logChannel: String,
    welcomeInfo: {type: Object},
    unverifiedRole: String,
    serverTiers: [{type: Object}]   
});

module.exports = mongoose.model("ServerConfig", configSchema, 'serverconfigs');