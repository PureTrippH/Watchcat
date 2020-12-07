exports.joinClub = async (client, message, filter) => { 
    message.channel.send({embed: {
		color: 0x00ff00,
		author: {
		name: client.user.username,
		icon_url: client.user.avatarURL
		},
		title: `Laela's Watchdog's Config - React to Emoji to Edit Config`,
		timestamp: new Date(),
		fields: [
			{
				name: '1️⃣ Club Category:',
				value: dbRes.removedRole,
				
			},
			{
				name: '2️⃣ Open Or Closed Clubs (User Created or Admin Created):',
				value: dbRes.verChannel,
				
			},
			{
				name: '3️⃣ Module Enabled:',
				value: dbRes.newUserRole,
				
			},
		],
		footer: {
		icon_url: client.user.avatarURL,
		text: client.user.username
		},
	}
	}).then(msg => {
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('3️⃣');
};