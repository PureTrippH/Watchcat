exports.run = async (client, message, args) => {
//Defined Required Modules and Packages.
	const ms = require("ms");
	const redis = require('../utils/redis');
	const serverStats = require("../utils/schemas/serverstat.js");
	const serverConfig = require("../utils/schemas/serverconfig.js");
	const queries = require("../utils/queries/queries.js");

	const tierArg = args[1].toLowerCase();
	const reason = args.slice(2).join(" ") || "Unknown Reason";
	const newText = args[0].replace('<@', '').replace('>', "").replace('!', "");
	const tagged = await message.guild.member(newText);

	const dbResConfig = await queries.queryServerConfig(message.guild.id);
	const user = await queries.queryUser(message.guild.id, tagged.id);
	
	const date = new Date();
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0'); 
	const yyyy = date.getFullYear();
	const banDate = { dd: dd, mm: mm, yyyy: yyyy}
	const tierIndex = dbResConfig.serverTiers.findIndex(tier => tier.TierName === tierArg);


	const dependencies = {
		redis,
		ms,
	}
	

	//Checks for Permissions and Args validity
	if(message.member.hasPermission('BAN_MEMBERS') || message.author.id == '168695206575734784') {
	if(!tagged || !args.length) return message.channel.send("No User Was Mentioned for the tiering");

	const user = await serverConfig.findOne(
		{
		  guildId: message.guild.id,
		}, 
		{
		  serverTiers: {
			$elemMatch: 
			{
				TierName: tierArg
			}
		  }
		});

		console.log(user);

	}
};

module.exports.help = {
	name: "Tier User",
	type: "moderation",
	desc: "Punishes the User for the Tier Time and Tier Type (ban, mute, warn, etc)",
	usage: "!!tier (user) (tier)",
	aliases: ["nt"]
}

	

