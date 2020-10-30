module.exports = async (client, guild) => {
  console.log("Hi");
  const mongoose = require('mongoose');
  const queries = require('../utils/queries/queries');
  let stats = await queries.queryServerStats(guild.id);
  await queries.queryServerConfig(guild.id);
  console.log(stats);
}