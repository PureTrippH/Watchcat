const mongoose = require("mongoose");
const clubSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    clubName: String,
    thumbnail: String,
    channelCount: Number,
    leader: String,
    members: [{type: String}]   
});

module.exports = mongoose.model("Club", clubSchema, 'clubs');