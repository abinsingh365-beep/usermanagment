import Users from "../db/model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY missing");
        }

        const token = jwt.sign(
            { user_id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};