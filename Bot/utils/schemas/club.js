const mongoose = require("mongoose");
const clubSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    clubName: String,
    thumbnail: String,
    desc: String,
    channelCount: Number,
    leader: String,
    textChat: String,
    members: [{type: String}],
    events: [{type: String}]   
});

module.exports = mongoose.model("Club", clubSchema, 'clubs');