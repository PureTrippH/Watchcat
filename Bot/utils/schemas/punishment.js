const mongoose = require("mongoose");
const punishmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    modID: String,
    guildID: String,
    tier: String,
    type: String,
    expires: {
        type: Date,
        required: true
    },
    stale: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Punishment", punishmentSchema, 'Punishments');