const mongoose = require("mongoose");
const configSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    messageCountTotal: Number,
    guildMembersInt: Number,
    guildMembers: [{type: Object}]
});

module.exports = mongoose.model("ServerStat", configSchema, 'serverstats');