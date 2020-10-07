const mongoose = require("mongoose");

const premuser = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discordId: String,
    background: String,
    Medal: String,
});

module.exports = mongoose.model("premuser", premuser);