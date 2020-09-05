const fs = require('fs');
const Discord = require('discord.js');

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: '' });

manager.on('shardCreate', shard => console.log(`Shard Running: #${shard.id}`));
manager.spawn();


