import mongoose, { connect } from "mongoose";
import { DB_URI , NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error('Please define the MONGODB_URI enviroment variable inside .env<development/production>.local')
}

const connectToDatabase = async()=>{
    try {
        await mongoose.connect(DB_URI);

        console.log(`connected to Database in ${NODE_ENV} mode`)
    } catch (error) {
        console.log('error connecting to DATABASE', error);
        process.exit(1);
    }
}

export default connectToDatabase;