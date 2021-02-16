const mongoose = require("mongoose");
const embedSchem = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    embedId: String,
    embedInfo: {type: Object}   
});

module.exports = mongoose.model("ServerEmbed", embedSchem, 'serverembeds');