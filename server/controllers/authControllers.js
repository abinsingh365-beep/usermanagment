import User from "../db/model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHandler.js";
import crypto from "crypto";
import nodemailer from "nodemailer";


export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and Password are required"
      });
    }

    // 2. Find user + populate user_type
    const user = await User.findOne({ email }).populate("user_type");

    console.log("USER =", JSON.stringify(user, null, 2));

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid password"
      });
    }

    // 4. Get role safely
    const role = user.user_type?.user_type; // ADMIN / EMPLOYEE

    if (!role) {
      return res.status(400).json({
        status: false,
        message: "User role not assigned"
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Send response
    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        user_type: role
      }
    });

  } catch (error) {
    console.error("Signin Error:", error);

    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message
    });
  }
};




// Forgot Password
export const forgotPassword = async (req, res) => {
  try {

    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords not match"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};




