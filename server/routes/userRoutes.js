import express from "express";
import upload from "../middleware/fileUpload.js";

import {
    registerUser,
    addUser,
    getAllUsers,
    updateUser,
    deleteUser,
    changePassword,
    testAdduser,
    getUserById,
    updateName,
    updateEmail,
    updatePassword,
    updateProfile,
    updateProfileImage
} from "../controllers/userController.js";

import accesscontroll from "../middleware/access_controll.js";


function setAccessControl(access_types) {

    return (req, res, next) => {

        return accesscontroll(
            access_types,
            req,
            res,
            next
        );

    };

}


const router = express.Router();


// Add User
router.post(
    "/add-user",
    setAccessControl("*"),
    addUser
);


// Get All Users
router.get(
    "/all-users",
    setAccessControl("*"),
    getAllUsers
);


// Update User
router.put(
    "/update-user/:id",
    setAccessControl("1,2"),
    updateUser
);


// Delete User
router.delete(
    "/delete-user/:id",
    setAccessControl("*"),
    deleteUser
);


// Change Password
router.put(
    "/change-password",
    setAccessControl("1,2"),
    changePassword
);


// Test Upload
router.post(
    "/testAdduser",
    setAccessControl("*"),
    upload.array("photo",4),
    testAdduser
);


// Get User By ID
router.get(
    "/user/:id",
    setAccessControl("2"),
    getUserById
);


// Update Name
router.put(
    "/update-name/:id",
    setAccessControl("1,2"),
    updateName
);


// Update Email
router.put(
    "/update-email/:id",
    setAccessControl("1,2"),
    updateEmail
);


// Update Password
router.put(
    "/update-password/:id",
    setAccessControl("1,2"),
    updatePassword
);


// Update Name + Email + Password
router.put(
    "/update-profile/:id",
    setAccessControl("1,2"),
    updateProfile
);


// Update Profile Image
router.put(
    "/update-profile-image/:id",
    setAccessControl("1,2"),
    upload.single("photo"),
    updateProfileImage
);



export default router;