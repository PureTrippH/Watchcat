exports.runClub = async (client, message) => { 
	const redis = require("../../utils/redis");
	const clubConfigSchema = require("../../utils/schemas/clubConfig");
	const clubSchema = require("../../utils/schemas/club");
	let memberClub = await clubSchema.findOne({
			guildId: message.guild.id,
			leader: message.author.id
		});
	const thisConf = await clubConfigSchema.findOne({
		guildId: message.guild.id
	});

	const redisClient = await redis()
	memberClub.updateOne({
		$inc: {
			channelCount: 1
		}
	}).then(res => {
		console.log("It worked ig?");
	});
	if(memberClub.channelCount >= 1) return message.author.send("You Have Reached the Max VC Count!");
	if(!memberClub || (message.author.id != memberClub.leader)) return message.author.send("You Are Not A Club Leader!");
			const clubRole = await message.guild.roles.create({
				data: {
				name: `${memberClub.clubName}`,
			}, reason: 'Club Requested a VC',
		});


			const vc = await message.guild.channels.create(`${memberClub.clubName} - VC`, {
				type: 'voice',
				permissionOverwrites: [
					{
						id: clubRole.id,
						allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM']
					},
					{
						id: message.guild.id,
						deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM']
					}]
			});
			vc.setParent(thisConf.category);

		await redisClient.set(`clubVC-${vc.id}-${clubRole.id}-${message.guild.id}`, 'true', 'EX', 3600);

		memberClub.members.forEach(mem => {
			console.log(mem);
			(message.guild.members.cache.get(mem)).roles.add(clubRole);
		})

		

		}