exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const infoBoard = new Discord.MessageEmbed();

    message.delete({ timeout: 200 });
    infoBoard.setColor('#660033');
  infoBoard.setFooter(`Watchcat - Created Jul 23 2020`, "https://images.vexels.com/media/users/3/140908/isolated/preview/bdc30bbe3c022a11e2d7fd0e642c61ae-open-book-icon-by-vexels.png");
    infoBoard.setTimestamp();
    infoBoard.setTitle(`Watchcat`);
    infoBoard.setAuthor(`Watchcat`, 'https://lh3.googleusercontent.com/proxy/qATfAOL5i1fYQGxrOQIF8ZIP-CPwZvcISjfpHdYpvDFFfgNkW1MgZN7_5zI84S9rOblRAPCjWVPHHEhV0BrpT0r9WUhsQrSSik8aRvL12gwIEHFQa30OudA2o0g5nylM')
    infoBoard.setThumbnail('https://images.vexels.com/media/users/3/140908/isolated/preview/bdc30bbe3c022a11e2d7fd0e642c61ae-open-book-icon-by-vexels.png');
    infoBoard.addFields(
      { name: `Developer -`, value: `<@168695206575734784>`, inline: false },
      { name: `Website -`, value: `https://watchcat.live`, inline: false },
      { name: `Github -`, value: `https://github.com/PureTrippH/LaelasWatchdog`, inline: false },
      { name: `Original Server (Give it A Try) -`, value: `https://discord.gg/zuucPzh`, inline: false },
      { name: `Special Thanks -`, value: `<@682973280009060467> - Allowing me to run and fully develop this project`, inline: false }
    );

    message.author.send(infoBoard);
}

module.exports.help = {
  name: "Information",
  type: "misc",
  aliases: ["inf"],
	desc: "Shows information and story about bot. You will Receive a DM from Watchcat.",
	usage: "!!info",
  gif: "https://cdn.discordapp.com/attachments/812824734860312587/812824979425984532/2021-02-20_18-15-21.gif"
}