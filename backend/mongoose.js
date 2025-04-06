require('dotenv').config();
let { connect, Promise, connection } = require("mongoose");

/**
 * @class Catalyst Mongoose
 */

module.exports = class CatalystMongoose {
    /**
     * Initiates Mongoose Client
     */

    init() {
        const dbOptions = {
            autoIndex: false,
            family: 4,
            connectTimeoutMS: 10000
        };

        connect(process.env.MONGO_URL, dbOptions);
        Promise = global.Promise;

        connection.on('connected', () => {
            console.log('Connected to MongoDB Successfully!');
        });

        connection.on('err', (error) => {
            console.error(`Error Occured From MongoDB: \n${error.message}`);
        });

        connection.on('disconnected', () => {
            console.warn('Connection Disconnected!');
        });
    }
};