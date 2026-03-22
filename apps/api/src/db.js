import mongoose from 'mongoose';

// const uri  = process.env.MONGODB_URI || 'mongodb://mongo:27017/meeting_intel';
const uri  = 'mongodb://127.0.0.1:27017/meeting_intel';

export async function connectDb(params) {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
}

export function isMongoReady(){
    return mongoose.connection.readyState === 1;
}