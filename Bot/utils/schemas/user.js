const mongoose = require("mongoose");
const user = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    globalMessageCount: Number,
    Tiers: [{type: String}],
    mangaSaves: [{type: Object}],
});

module.exports = mongoose.model("User", user, 'users');