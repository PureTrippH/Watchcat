exports.post = async (client, message, filter) => { 
	const mongoose = require("mongoose");
	const moment = require("moment");
	const clubSchema = require("../../utils/schemas/club");
	const serverConfig = require("../../utils/schemas/clubConfig");

	let memberClub = await clubSchema.findOne({
		guildId: message.guild.id,
	});
	message.channel.send("Please Send the Date of the Event (Example 02-31-2020 [MM-DD-YYYY]), then in a new message The Time of the Event **ALL IN EST**");
	message.channel.awaitMessages(filter, {max:2}).then(async collected => {
		const time = collected.last().content;
		const timeArr = time.split(":");
		const myMomentObject = moment(collected.first().content, 'MM-DD-YYYY').set({"hour": timeArr[0], "minute": timeArr[1]});
		console.log(myMomentObject);
	});
};