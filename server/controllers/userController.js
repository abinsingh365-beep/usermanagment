
import { errorResponse, successResponse } from "../utils/responsehandler.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import passwordTemplate from "../utils/passwordTemplate.js";
import sendMail from "../utils/sendMail.js";
import User from "../db/model/User.js";


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
      LOGIN_URL: "http://localhost:5173/login",
      PASSWORD: password
    }

    const content = passwordTemplate(password_variables);
    await sendMail(email, "your account password", content);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // // Get user type from env
    const user_type = process.env.EMPLOYEE_USERTYPE;

    // Create user
    await Users.create({
      name,
      email,
      password: hashedPassword,
      user_type: process.env.EMPLOYEE_USERTYPE,
      role: "EMPLOYEE"
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

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        const match = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                message: "Old password is incorrect"
            });
        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        user.is_password_reset = true

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
      console.log("err from change password");
      
        res.status(500).json({
            message: error.message
        });
    }
};

export const testAdduser = async (req,res)=>{
  const {name, email} = req.body;
  const photo = req.files.map(file=>file.path);

console.log(req.file);
   
    const responsee = successResponse({
      message:"data recieved successfully",
      data:{name,email,photo}
    })
    return res.status(responsee.statusCode).send(responsee);
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("user_type");

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        return res.json({
            status: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};




// Update Name
export const updateName = async (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        res.json({
            status: true,
            message: "Name updated successfully",
            data: user
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

// Update Email
export const updateEmail = async (req, res) => {

    try {

        const { id } = req.params;
        const { email } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { email },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        res.json({
            status: true,
            message: "Email updated successfully",
            data: user
        });

    } catch (err) {

        res.status(500).json({
            status: false,
            message: err.message
        });

    }

};

// Update Password
export const updatePassword = async (req, res) => {

    try {

        const { id } = req.params;
        const { password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        res.json({
            status: true,
            message: "Password updated successfully"
        });

    } catch (err) {

        res.status(500).json({
            status: false,
            message: err.message
        });

    }

};

export const updateProfile = async (req, res) => {

    try {

        const { id } = req.params;

        const { name, email, password } = req.body;


        const updateData = {
            name,
            email
        };


        // Update password only if user entered new password
        if(password && password.trim() !== ""){

            updateData.password = await bcrypt.hash(password,10);

        }


        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new:true }
        );


        if(!user){

            return res.status(404).json({
                status:false,
                message:"User not found"
            });

        }


        res.json({

            status:true,
            message:"Profile updated successfully",
            data:user

        });


    } catch(err){

        res.status(500).json({

            status:false,
            message:err.message

        });

    }

};


export const updateProfileImage = async (req, res) => {

    try {

        console.log("FILE:", req.file);


        const { id } = req.params;


        if (!req.file) {

            return res.status(400).json({

                status: false,

                message: "Please select an image"

            });

        }


        const user = await User.findByIdAndUpdate(

            id,

            {
                profile_image: req.file.filename
            },

            {
                new: true
            }

        );


        if (!user) {

            return res.status(404).json({

                status: false,

                message: "User not found"

            });

        }


        return res.json({

            status: true,

            message: "Profile image updated successfully",

            data: {

                profile_image: user.profile_image

            }

        });


    } catch (error) {


        console.log(error);


        return res.status(500).json({

            status: false,

            message: error.message

        });

    }

};
