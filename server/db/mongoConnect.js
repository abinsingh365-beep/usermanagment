import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
const mongoConnect = async () => {
    try {

        if (mongoose.connection.readyState === 1) {
            return;
        }

        if (mongoose.connection.readyState === 2) {
            await mongoose.connection.asPromise();
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connection.asPromise();
        }

        console.log("MongoDB connected successfully");

    } catch (err) {

        console.error("MongoDB connection error:", err.message);

        process.exit(1);
    }
};

export default mongoConnect;