exports.create = async (client, message) => { 
	const mongoose = require("mongoose");
	const clubSchema = require("../../utils/schemas/club");
	const serverConfig = require("../../utils/schemas/clubConfig");

	const clubInfo = {
		title: null,
		thumbnail: null,
		desc: null,
		leader: "none",
	}

	const filter = m => m.author.id === message.author.id;
	const Discord = require("discord.js");
	const thisConfig = await serverConfig.findOne({
		guildId: message.guild.id
	});

	if(!thisConfig) return message.channel.send("You Need to Create a Config!");
	console.log(thisConfig.systemType);
	if(thisConfig.systemType == "closed") {
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.author.send("This Server Used a `Closed` club Option: Meaning only Mods can create Clubs For Users to Control the Flow Of Clubs");
		message.channel.send("Closed Mode!: Please Enter the Leader");
		await message.channel.awaitMessages(filter, {max:1}).then(collected => 
			{
				clubInfo.leader = collected.first().content;
			});
		}
	message.channel.send("Please Insert A Club Name And A Club Thumbnail (In Separate Messages Please):");
	if(clubInfo.leader == "none") clubInfo.leader = message.author.id;
	message.channel.awaitMessages(filter, {max:3}).then(async collected => {

		clubInfo.desc = collected.array()[1].content;
		clubInfo.title = collected.first().content;
		clubInfo.thumbnail = collected.last().content;

		let embed = new Discord.MessageEmbed();
		embed.setTitle(`Confirm ${clubInfo.title}?`);
		try {
			embed.setThumbnail(clubInfo.thumbnail);
		} catch(err) {
			return message.channel.send("Not a Valid Image!");
		}
		message.channel.send(embed).then(msg => {
		msg.react('✅');
		msg.react('❌');
		msg.awaitReactions((reaction, user) => user.id == message.author && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
			{ max: 1, time: 50000 }).then(collected => {
			console.log(collected.first().emoji.name);
			if(collected.first().emoji.name == '✅') {
				const newClub = new clubSchema({
					_id: mongoose.Types.ObjectId(),
					guildId: message.guild.id,
					clubName: (clubInfo.title).toLowerCase(),
					channelCount: 0,
					desc: clubInfo.desc,
					thumbnail: clubInfo.thumbnail,
					leader: clubInfo.leader,
					members: [clubInfo.leader]
				});
				newClub.save();
				let user = message.guild.members.cache.get(clubInfo.leader)
				embed.setTitle(`Created Club for: ${user} - ${clubInfo.title}`);
				embed.setImage(clubInfo.thumbnail);
				user.send(embed);
			}
			});
		});

		});

};