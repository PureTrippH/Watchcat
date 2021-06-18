const mongoose = require("mongoose");
const mangaSave = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mangaID: String,
    userID: String,
    chapterNum: Number,
    pageNum: Number,
});

module.exports = mongoose.model("MangaSave", mangaSave, 'mangasaves');