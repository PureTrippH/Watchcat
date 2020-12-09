exports.config = async (client, message, filter) => { 
    const mongoose = require('mongoose');
    const clubConfig = require('../../utils/schemas/clubConfig');
    
    const thisClubServ = await clubConfig.findOne({
		guildId: message.guild.id
	}, (err, guildConfig) => {
		if(!guildConfig) {
            mongoose.Types.ObjectId()
			console.log("No Data Found!");
			const newConfig = new clubConfig({
				_id: mongoose.Types.ObjectId(),
				guildId: message.guild.id,
                category: "blank",
                systemType: "open"
			});

			newConfig.save();
			
			return message.channel.send("Welcome To The Club Module! Generating Your Club Config...");
		}
	},{upsert:true});


    message.channel.send({embed: {
		color: 0xffff00,
		author: {
		name: client.user.username,
		icon_url: client.user.avatarURL
		},
		title: `Club Module Config - React to Emoji to Edit Config`,
		timestamp: new Date(),
		fields: [
			{
				name: '1️⃣ Club Category:',
				value: thisClubServ.category,
				
			},
			{
				name: '2️⃣ Open Or Closed Clubs (User Created or Admin Created):',
				value: thisClubServ.systemType,
				
			},
			{
				name: '3️⃣ Module Enabled:',
				value: 'true',
				
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
        
        msg.awaitReactions((reaction, user) => user.id == message.author.id,
        { max: 1, time: 50000 }).then(collected => {
                    const reaction = collected.first().emoji.name;
                    console.log(reaction);
                    if(collected.first().emoji.name == '1️⃣') {
                        message.channel.send("Please send a Category:");
                        message.channel.awaitMessages(filter, {
                            max: 1
                        }).then(collectedtext => {
                        thisClubServ.updateOne({
                                category: collectedtext.first().content
                            });
                        });
                    }   
            if(collected.first().emoji.name == '2️⃣') {
                message.channel.send("Choose a System: Open📖 (Any Users can Create a Club) or Closed📕 (Admins create User Clubs)");
                msg.react('📖');
                msg.react('📕');
                msg.awaitReactions((reaction, user) => user.id == message.author && (reaction.emoji.name == '📖' || reaction.emoji.name == '📕'),
                    { max: 1, time: 50000 }).then(async collected => {
                        if(collected.first().emoji.name == '📕') {
                            console.log("closed");
                            thisClubServ.updateOne({
                                systemType: "closed"
                            });
                        } else {
                            console.log("open");
                            thisClubServ.updateOne({
                                systemType: "open"
                            });
                        }
                    });
                }
            });
        })
};
