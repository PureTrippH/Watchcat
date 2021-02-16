exports.create = async (client, message) => { 
	const mongoose = require("mongoose");
	const clubSchema = require("../../utils/schemas/club");
	const serverConfig = require("../../utils/schemas/clubConfig");

	const clubConfig = require('../../utils/schemas/clubConfig');
    
    const thisClubServ = await clubConfig.findOne({
		guildId: message.guild.id
	});

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
	message.channel.send("Please Insert A Club Name, Club Description, A Club Thumbnail (In Separate Messages Please):");
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
			{ max: 1, time: 50000 }).then(async collected => {
			console.log(collected.first().emoji.name);
			if(collected.first().emoji.name == '✅') {

				message.guild.channels.create(`${(clubInfo.title).toLowerCase()}`, {
					permissionOverwrites: [{
						id: message.guild.id,
						deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
					},
					{
						id: message.author.id,
						allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
					}]
				}).then(async textChat => {
					console.log(textChat.id);
					textChat.setParent(thisClubServ.category);
					const newClub = new clubSchema({
						_id: mongoose.Types.ObjectId(),
						guildId: message.guild.id,
						clubName: (clubInfo.title).toLowerCase(),
						channelCount: 0,
						desc: clubInfo.desc,
						thumbnail: clubInfo.thumbnail,
						leader: clubInfo.leader,
						textChat: textChat.id,
						members: [clubInfo.leader],
						events: []
					});
					newClub.save();
				});
				
				let user = message.guild.members.cache.get(clubInfo.leader)
				embed.setTitle(`Created Club for: ${user} - ${clubInfo.title}`);
				embed.setImage(clubInfo.thumbnail);
				user.send(embed);
			}
			});
		});

		});

};


const makePermOvArray = async(arr, message) => {
	let mast = [{
		id: message.guild.id,
		deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
	}];
	arr.forEach(member => {
		if(member != message.author.id) {
		let JSON = {
			id: member,
			allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
		};
		console.log(JSON);
		mast.push(JSON);
	}
	});
		console.log(mast);
	return mast;
}