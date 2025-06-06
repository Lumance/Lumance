import dotenv from 'dotenv';
import mongoose from 'mongoose';

let { connect, Promise, connection } = mongoose;

dotenv.config();

/**
 * @class Catalyst Mongoose
 */
export default class CatalystMongoose {
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
}