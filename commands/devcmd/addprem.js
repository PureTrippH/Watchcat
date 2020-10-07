const mongoose = require("mongoose");
exports.addPremUser = async (client, message, args, tagged) => {
  const premUser = require("../../utils/schemas/premuser.js");
  const queries = require("../../utils/queries/queries.js");

if(await queries.queryPremUser(message.guild.id, tagged.id)) return message.author.send("User Already Added to Premium");

  message.delete({ timeout: 200 });
  let parsedNum = parseInt(args[2]);
  const newConfig = new premUser({
    _id: mongoose.Types.ObjectId(),
    discordId: tagged.id,
    background: "https://img.wallpapersafari.com/desktop/1536/864/93/84/x7tXzR.jpg",
    Medal: "blank",
  });

  newConfig.save();

  message.author.send("Added User to Database");
}