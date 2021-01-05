const mongoose = require("mongoose");
const clubConfigSchem = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    category: String,
    systemType: String
});

module.exports = mongoose.model("ClubConfig", clubConfigSchem, 'clubconfigs');