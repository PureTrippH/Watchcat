//Most Likely should Optimize this Spaghetti Code.
exports.editor = async (ID, selEmbed, message) => {
  const Discord = require('discord.js');
  const embedSchem = require('../../utils/schemas/embeds');
  const mongoose = require('mongoose');
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Edit Embed");
  console.log(embed)
  embed.setDescription("Welcome to the New Embed Builder. Choose An Option Below.");
  embed.addFields({ name: `1️⃣`, value: `Change Color:`});
  embed.addFields({ name: `2️⃣`, value: `Set Thumbnail:`});
  embed.addFields({ name: `3️⃣`, value: `Set Title:`});
  embed.addFields({ name: `4️⃣`, value: `Set Description:`});
  embed.addFields({ name: `5️⃣`, value: `Add Body:`});
  embed.addFields({ name: `6️⃣`, value: `Edit Specific Body:`});
  embed.addFields({ name: `7️⃣`, value: `Set Footer:`});
  embed.addFields({ name: `8️⃣`, value: `Set Image:`});
  embed.addFields({ name: `9️⃣`, value: `Preview Embed:`});
  embed.setImage
  console.log(selEmbed);
  message.channel.send(embed).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('3️⃣');
    msg.react('4️⃣');
		msg.react('5️⃣');
    msg.react('6️⃣');
		msg.react('7️⃣');
    msg.react('8️⃣');
    msg.react('9️⃣');
    msg.react('💾');
  msg.awaitReactions((reaction, user) => user.id == message.author.id, { max: 1 }).then(async collected => {
			let reaction = collected.first().emoji.name;
			console.log(reaction);
			switch(reaction) {
        case '1️⃣':
          message.channel.send(" V Please send a Hex Color (#ff00ff) V ");
          selEmbed.setColor(await collectMsg(message));
          return this.editor(ID, selEmbed, message);
				break;
        case '2️⃣':
          message.channel.send(" V Enter the Embed ID: (This is what you type to send the embed or edit it) V ");
          selEmbed.setThumbnail(await collectMsg(message));
          return this.editor(ID, selEmbed, message);
				break;
        case '3️⃣':
          message.channel.send(" V Enter an Embed Title V ");
          selEmbed.setTitle(await collectMsg(message));
          return this.editor(ID, selEmbed, message);
				break;
        case '4️⃣':
          message.channel.send(" V Enter a Description V ");
          selEmbed.setDescription(await collectMsg(message));
          return this.editor(ID, selEmbed, message);
				break;
        case '5️⃣':
          message.channel.send(" V Enter The Header V ");
          let header = await collectMsg(message);
          message.channel.send(" V Enter The Body Text V ");
          let body = await collectMsg(message);
          selEmbed.addFields({ name: header, value: body});
          return this.editor(ID, selEmbed, message);
				break;
        case '6️⃣':
          message.channel.send(" V Enter Body Number V ");
          let index = await collectMsg(message);
         if(index > embed.fields) {
           message.channel.send("Index Does Not Exist");
           return this.editor(ID, selEmbed, message);
         }
          message.channel.send(" V Enter The Header V ");
          let newHeader = await collectMsg(message);
          message.channel.send(" V Enter The Body Text V ");
          let newBody = await collectMsg(message);
          selEmbed.spliceFields((index-1), (index), { name: newHeader, value: newBody});
          return this.editor(ID, selEmbed, message);
				break;
        case '7️⃣':
          message.channel.send(" V Please Enter Text for the footer V ");
          selEmbed.setFooter(await collectMsg(message));
          return this.editor(ID, selEmbed, message);
				break;
        case '8️⃣':
          message.channel.send(" V Enter A Valid Image Link V ");
          selEmbed.setImage(await collectMsg(message));
          return this.editor(ID, selEmbed, message);
				break;
        case '9️⃣':
          message.channel.send(selEmbed);
          return this.editor(ID, selEmbed, message);
        break;
        case '💾':
          embedSchem.findOne({
            guildId: message.guild.id,
            embedId: ID.toLowerCase(),
          }).then(res => {
            if(!res) {
              const newEmbed = new embedSchem({
                _id: mongoose.Types.ObjectId(),
                guildId: message.guild.id,
                embedId: ID.toLowerCase(),
                embedInfo: selEmbed.toJSON()
              });
              newEmbed.save().then((err) => {
                console.log(err);
                message.channel.send("SAVED EMBED!");
              });
            } else {
              embedSchem.updateOne({
                guildId: message.guild.id,
                embedId: ID.toLowerCase(),
              }, {
                embedInfo: selEmbed.toJSON()
              }).then(err => {
                console.log(err);
                message.channel.send("Updated Embed Template!");
              })
            }
          })

        break;
      }
      });
  });
}

const collectMsg = async(message) => {
		const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
			max: 1
		})
		return msg.first().content;
}
