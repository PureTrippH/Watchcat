const mongoose = require("mongoose");
const pollschema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    channel: String,
    endDate: Date,
    message: String,
    type: String
});

module.exports = mongoose.model("Poll", pollschema, 'polls');