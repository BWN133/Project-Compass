// import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import env from "../src/util/validateEnv";
// let mongoDb: MongoMemoryServer;

export const connect = async() => {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    // const mongoDb = await MongoMemoryServer.create();
    // const uri = mongoDb.getUri();
    await mongoose.connect(env.MONGO_CONNECTION_STRING);
};




export const disconnect = async() => {
// The Server can be stopped again with
    await mongoose.disconnect();
    // await mongoDb.stop();
}

