const redis = require('redis');
const settings = require('../settings.json');

module.exports = async() => {
    return await new Promise((resolve, reject) => {
        const client = redis.createClient({
            url: settings.redisPath
        })

        client.on('error', (err) => {
            console.error("Error in The Redis Mute Server")
            client.quit()
            reject(err)
        })
        client.on('ready', () => {
            resolve(client);
        })
    })
}

module.exports.expire = (callback) => {
    const expired = () => {
        const sub = redis.createClient({ url: settings.redisPath});
        sub.subscribe('__keyevent@0__:expired', () => {
            sub.on('message', (channel, message) => {
                callback(message)
            })
        });
    }

    const pub = redis.createClient({ url: settings.redisPath});
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], expired());
}