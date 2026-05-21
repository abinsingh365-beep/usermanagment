import mongoConnect from "../db/mongoConnect.js";
import User from "../db/model/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const seeder = async () => {

    try {

        // Connect DB
        await mongoConnect();

        // Check if admin exists
        const adminExists = await User.findOne({
            email: "admin@gmail.com",
        });

        if (!adminExists) {

            const hashedPassword = await bcrypt.hash(
                "123456",
                10
            );

            await User.create({
                name: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin",
            });

            console.log("Admin created");

        } else {

            console.log("Admin already exists");

        }

        process.exit();

    } catch (error) {

        console.error("Seeder Error:", error);

        process.exit(1);

    }
};

seeder();