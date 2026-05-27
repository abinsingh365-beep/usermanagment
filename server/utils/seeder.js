import mongoConnect from "../db/mongoConnect.js";
import User from "../db/model/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

//  const ADMIN_ID =
//   new mongoose.Types.ObjectId("6a0ff2cf410c5c68a6793210");

// const EMPLOYEE_ID =
//   new mongoose.Types.ObjectId("6a0ff2e2410c5c68a6793211");

const userType =[
    {
        _id: "6a0ff2cf410c5c68a6793210",
        user_type :"ADMIN"

    }

    {
        _id:"6a0ff2e2410c5c68a6793211",
        user_types:"employee"
    }
]

const seeder = async () => {


    try {

        // Connect DB
        await mongoConnect();
        await user_type.insertmany()

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
                name: "Adminn",
                email: "adminn@gmail.com",
                password: hashedPassword,
                user_type: process.env.Admin_id
                

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