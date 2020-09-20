const mongoose = require('mongoose');
const serverConfig = require("../schemas/serverconfig.js");
const serverStats = require("../schemas/serverstat.js");


//Function to globally query the User in that server, and pass the information down to every command
const queryUser = async(guild, userId) => {
const user = await serverStats.findOne(
  {
    guildId: guild,
    "guildMembers.userID": userId
  }, 
  {
    guildMembers: {
      $elemMatch: 
      {
        userID: userId
      }
    }
  }, async(err, foundUser) => {
        if(!foundUser) {
        await serverStats.findOneAndUpdate(
          {
            guildId: guild
            }, 
            {
              $addToSet: {
              guildMembers: {
                userID: userId,
                messageCount: 1,
                punishmentsTiers: [],
                medals: []
              }
            }
          })}
        });

        return user;
};

const queryServerConfig = async(guild) => {
	return await serverConfig.findOne({
		guildId: guild
	}, (err, guildConfig) => {
		if(!guildConfig) {
			console.log("No Data Found!");
			const newConfig = new serverConfig({
				_id: mongoose.Types.ObjectId(),
				guildId: guild,
				removedRole: "blank",
				verChannel: "blank",
				newUserRole: "blank",
				mutedRole: "blank",
				logChannel: "blank",
				unverifiedRole: "blank",
				serverTiers: []
			});

			newConfig.save();
		}
  },{upsert:true});
};

module.exports = {queryServerConfig, queryUser}

//Hi