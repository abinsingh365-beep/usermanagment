import mongoConnect from "../db/mongoConnect.js";
import User from "../db/model/User.js";
import UserType from "../db/model/userType.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const userTypes = [
  {
    _id: new mongoose.Types.ObjectId("6a0ff2cf410c5c68a6793210"),
    user_type: "ADMIN",
  },
  {
    _id: new mongoose.Types.ObjectId("6a0ff2e2410c5c68a6793211"),
    user_type: "EMPLOYEE",
  },
];

const seeder = async () => {
  try {
    await mongoConnect();

    // Seed User Types
    await UserType.deleteMany({});
    await UserType.insertMany(userTypes);

    console.log("UserTypes seeded");

    // Check Admin
    const adminExists = await User.findOne({
      email: "admin@gmail.com",
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        user_type: userTypes[0]._id,
      });

      console.log("Admin created");
    } else {
      console.log("Admin already exists");
    }

    process.exit();
<<<<<<< HEAD
=======
    
>>>>>>> 44412a7 (usm page updated)

  } catch (error) {

    console.error("Seeder Error:", error);

    process.exit(1);

  }
};

seeder();