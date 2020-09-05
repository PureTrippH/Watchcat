const fs = require('fs');
const Discord = require('discord.js');

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: 'NzM1NTU5NTQzODg2NDQ2NzEy.XxiBNQ.AF14sfGrG0tHlvlOB6-Sqr1-GzM' });

manager.on('shardCreate', shard => console.log(`Shard Running: #${shard.id}`));
manager.spawn();


