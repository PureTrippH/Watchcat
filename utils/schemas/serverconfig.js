const mongoose = require("mongoose");
const configSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    removedRole: String,
    verChannel: String,
    prefix: String,
    newUserEnabled: String,
    newUserRole: String,
    serverTiers: [{type: Object}]   
});

module.exports = mongoose.model("ServerConfig", configSchema, 'serverconfigs');