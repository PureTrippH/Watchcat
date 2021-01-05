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
	
			const vc = await message.guild.channels.create(`${memberClub.clubName} - VC`, {
				type: 'voice',
				permissionOverwrites: await makePermOvArray(memberClub.members, message.guild.id),
			});
			vc.setParent(thisConf.category);

		await redisClient.set(`clubVC-${vc.id}-${message.guild.id}`, 'true', 'EX', 20);

		

		}


const makePermOvArray = async(arr, guildId) => {
	let mast = [{
		id: guildId,
		deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM']
	}];
	arr.forEach(member => {
		let JSON = {
			id: member,
			allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM']
		};
		console.log(JSON);
		mast.push(JSON);
	});
		console.log(mast);
	return mast;
}