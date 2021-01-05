const mongoose = require("mongoose");
const user = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    authorID: String,
    messageCount: Number,
    Tiers: [{type: String}],
    Medals: [{type: String}],
});

module.exports = mongoose.model("User", user, 'users');