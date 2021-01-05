const mongoose = require("mongoose");

const pastuser = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    discordTag: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    },
    guilds: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model("pastuser", pastuser);