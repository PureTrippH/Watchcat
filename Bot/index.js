const settings = require('./settings.json');

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: settings.token });

manager.on('shardCreate', shard => console.log(`Shard Running: #${shard.id}`));
manager.spawn();


