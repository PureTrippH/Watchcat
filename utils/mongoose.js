const mongoose = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4,
        };
            mongoose.connect(process.env.MONGO_LINK, dbOptions);
            mongoose.set('useFindAndModify', false);
            mongoose.promise = global.Promise;
            mongoose.connection.on('connected', () => {
                console.log("Laela's Watchdog has connected to MongoDB");
            });
            
            mongoose.connection.on('err', err => {
                console.log("ERROR: " + err);
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log("Bai Bai Mongo. Ill be back soon!");
            });

    }
}