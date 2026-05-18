import mongoConnect from "../db/mongoconnect.js"
import bcrypt from "bcrypt"


const seeder = async () => {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("123456", 10);

        await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created");
    } else {
        console.log("Admin already exists");
    }
};

export default seeder;