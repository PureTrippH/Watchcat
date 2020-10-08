const mongoose = require("mongoose");
exports.addPremUser = async (client, message, args, tagged) => {
  const premUser = require("../../utils/schemas/premuser.js");
  const queries = require("../../utils/queries/queries.js");

  const filter = m => m.author.id === message.author.id;

  message.channel.send("Please send a Link To An Image");
  message.channel.awaitMessages(filter, {
    max: 1
  }).then(collectedtext => {
    premUser.updateOne({
      Medal: collectedtext.first().content
    }).exec();
    message.author.send("Successfully Added Medal");
  });
}