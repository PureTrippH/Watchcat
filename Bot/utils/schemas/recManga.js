const mongoose = require("mongoose");
const recManga = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mangaTitle: {
        type: String,
        required: true,
        unique: true,
    },
    recommendation: {
        type: String,
        required: true,
    },
    mangaImage: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("recmanga", recManga);