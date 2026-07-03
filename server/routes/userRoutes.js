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
  updatePassword
} from "../controllers/userController.js";
import accesscontroll from "../middleware/access_controll.js"


function setAccessControl(access_types) {
  return (req, res, next) => {
    return accesscontroll(access_types, req, res, next)
  }
}
const router = express.Router();

// router.post("/register",setAccessControl("1"), registerUser);

router.post("/add-user", setAccessControl("*"), addUser);

router.get("/all-users", setAccessControl("*"), getAllUsers);

router.put("/update-user/:id", setAccessControl("1,2"), updateUser);

router.delete("/delete-user/:id", setAccessControl("*"), deleteUser);
router.put(
  "/change-password",
  setAccessControl("1,2"),
  changePassword
);
router.post("/testAdduser", setAccessControl("*"), upload.array("photo", 4), testAdduser)
router.get("/user/:id", setAccessControl("2"), getUserById);
router.put("/update-name/:id", setAccessControl("1,2"), updateName);
router.put("/update-email/:id", setAccessControl("1,2"), updateEmail);
router.put("/update-password/:id", setAccessControl("1,2"), updatePassword);





export default router;