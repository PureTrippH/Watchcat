const mongoose = require('mongoose');
const serverConfig = require("../schemas/serverconfig.js");
const serverStats = require("../schemas/serverstat.js");
const premUser = require("../schemas/premuser.js");


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
        let newUser = await serverStats.findOneAndUpdate(
          {
            guildId: guild
            }, 
            {
              $addToSet: {
              guildMembers: {
                userID: userId,
                vcMinutes: 1,
                messageCount: 1,
                punishmentsTiers: [],
                medals: []
              }
            }
          }).exec();
          return newUser;
        }
        }).limit(1).lean().select({});
        
        return user;
};

const queryServerStats = async(guild, client) => {
  return await serverStats.findOne({
    guildId: guild
  }, (err, guildStats) => {
    if(!guildStats) {
      console.log("No Data Found!");
      //Creates a New Stats Schema
      const newStats = new serverStats({
        _id: mongoose.Types.ObjectId(),
        guildId: guild,
        messageCountTotal: 0,
        guildMembersInt: 1,
        guildMembers: []
      });
      newStats.save();
    }
  }).limit(1).lean().select({guildMembers: []});
};

const queryPremUser = async(guild, client) => {
	return await premUser.findOne({
		discordId: client
  });
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
  },{upsert:true}).limit(1);
};

const newServerStats = async(guild, client) => {
  return await serverStats.findOne({
    guildId: guild
  }, (err, guildStats) => {
    if(!guildStats) {
      console.log("No Data Found! - Stats");
      //Creates a New Stats Schema
      const newStats = new serverStats({
        _id: mongoose.Types.ObjectId(),
        guildId: guild,
        messageCountTotal: 0,
        guildMembersInt: 1,
        guildMembers: []
      });
      newStats.save();
    }
  },{upsert:true}).limit(1).lean();
};


module.exports = {queryPremUser, queryServerConfig, queryUser, queryServerStats, newServerStats}

//Hi