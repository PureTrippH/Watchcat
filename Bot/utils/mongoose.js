const mongoose = require('mongoose');
const settings = require('../settings.json');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4,
            useFindAndModify: false,
        };
            mongoose.connect(settings.mongoose, dbOptions);
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useFindAndModify', false);
            mongoose.set('useCreateIndex', true);
            mongoose.set('useUnifiedTopology', true)
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

//Hi