import mongoose from "mongoose"
import 'colors'
import dotenv from 'dotenv';

dotenv.config()

export const dbConnect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to Database`.bgGreen.bold);
    } catch (error) {
        console.log(`Error: ${error}`.bgRed.bold);
    }
}