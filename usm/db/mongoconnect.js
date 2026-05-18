import mongoose from "mongoose";

const mongoConnect = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully");

    } catch (err) {
        console.error("MongoDB connection error:", err.message);

        process.exit(1);
    }
};

export default mongoConnect;