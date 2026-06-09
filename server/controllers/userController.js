import Users from "../db/model/user.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import passwordTemplate from "../utils/passwordTemplate.js";
import sendMail from "../utils/sendMail.js";


dotenv.config();

export const addUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check required fields
    if (!name || !email) {
      let response = errorResponse({
        message: "all fields are required"
      });

      return res.status(response.statusCode).send(response);
    }

    // Check existing user
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      let response = errorResponse({
        message: "user already exists"
      });

      return res.status(response.statusCode).send(response);
    }

    // Generate random password
    function generatePassword(length = 8) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

      let password = "";

      for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
      }

      return password;
    }

    const password = generatePassword();

    let password_variables = {
      USER_NAME: name,
      EMAIL: email,
      LOGIN_URL: "http://localhost:3000/adminlogin.html",
      PASSWORD : password
    }

    const content = passwordTemplate(password_variables);
    await sendMail(email, "your account password", content);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // // Get user type from env
    const user_type = process.env.EMPLOYEE_USERTYP;

    // Create user
    await Users.create({
      name,
      email,
      password: hashedPassword,
      user_type:process.env.EMPLOYEE_USERTYPE,
      role:"employee"
    });

    // Success response
    let response = successResponse({
      statusCode: 201,
      message: "user created successfully",
      data: {
        name,
        email,
        password,
       
      }
    });

    return res.status(response.statusCode).send(response);

  } catch (err) {
    console.log("error from addUser : ", err.message || err);

    let response = errorResponse({
      message: err.message ? err.message : "something went wrong",
      statusCode: 500
    });

    return res.status(response.statusCode).send(response);
  }
};

export const getAllUsers = async (req, res) => {
  try {

    const users = await Users.find().select("-password");

    if (!users || users.length === 0) {
      let response = errorResponse({
        message: "no users found",
        statusCode: 404
      });

      return res.status(response.statusCode).send(response);
    }

    let response = successResponse({
      statusCode: 200,
      message: "users fetched successfully",
      data: users
    });

    return res.status(response.statusCode).send(response);

  } catch (err) {

    console.log("error from getAllUsers :", err.message || err);

    let response = errorResponse({
      message: err.message ? err.message : "something went wrong",
      statusCode: 500
    });

    return res.status(response.statusCode).send(response);
  }
};
export const updateUser = async (req, res) => {
  try {

    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedUser) {

      let response = errorResponse({
        message: "user not found",
        statusCode: 404
      });

      return res.status(response.statusCode).send(response);
    }

    let response = successResponse({
      statusCode: 200,
      message: "user updated successfully",
      data: updatedUser
    });

    return res.status(response.statusCode).send(response);

  } catch (err) {

    console.log("error from updateUser :", err.message || err);

    let response = errorResponse({
      message: err.message || "something went wrong",
      statusCode: 500
    });

    return res.status(response.statusCode).send(response);
  }
};
export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    const deletedUser = await Users.findByIdAndDelete(id);

    if (!deletedUser) {

      let response = errorResponse({
        message: "user not found",
        statusCode: 404
      });

      return res.status(response.statusCode).send(response);
    }

    let response = successResponse({
      statusCode: 200,
      message: "user deleted successfully"
    });

    return res.status(response.statusCode).send(response);

  } catch (err) {

    console.log("error from deleteUser :", err.message || err);

    let response = errorResponse({
      message: err.message || "something went wrong",
      statusCode: 500
    });

    return res.status(response.statusCode).send(response);
  }
};
export const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {

      let response = errorResponse({
        message: "all fields are required",
        statusCode: 400
      });

      return res.status(response.statusCode).send(response);
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      let response = errorResponse({
        message: "user already exists",
        statusCode: 400
      });

      return res.status(response.statusCode).send(response);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      user_type: process.env.EMPLOYEE_USERTYPE
    });

    let response = successResponse({
      statusCode: 201,
      message: "user registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

    return res.status(response.statusCode).send(response);

  } catch (err) {

    console.log("error from registerUser :", err.message || err);

    let response = errorResponse({
      message: err.message || "something went wrong",
      statusCode: 500
    });

    return res.status(response.statusCode).send(response);
  }
};