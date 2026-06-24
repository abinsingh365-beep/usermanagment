import User from "../db/model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { log } from "console";
import sendMail from "../utils/sendMail.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"


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
        { id: user._id },
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User account not found",
      });
    }

    // Create reset token
    const resetToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Save token in database
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password_token: resetToken,
        },
      }
    );

    // Create reset link
const resetLink =
`${process.env.FRONTEND_URL}/resetPassword.html?token=${resetToken}`;

    // Create email content
    const emailContent = forgotPasswordTemplate({
      USER_NAME: user.name,
      FORGOT_PASSWORD_URL: resetLink,
    });

    // Send email
    await sendMail(
      email,
      "Reset Password",
      emailContent
    );

    return res.status(200).json({
      status: true,
      message: "Password reset link has been sent",
    });
    console.log("Reset Link:", resetLink);

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};




// Forgot Password

export const forgotPasswordReset = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Check required fields
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords do not match",
      });
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const data = await User.updateOne(
      { _id: decoded.user_id },
      {
        $set: {
          password: hashedPassword,
          password_token: null,
        },
      }
    );

    if (data.matchedCount === 1 && data.modifiedCount === 1) {
      return res.status(200).json({
        status: true,
        message: "Password changed successfully",
      });
    }

    return res.status(400).json({
      status: false,
      message: "Password update failed",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
