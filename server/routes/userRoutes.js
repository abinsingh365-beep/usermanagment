import express from "express";

import {
  registerUser,
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword
} from "../controllers/userController.js";
import accesscontroll from "../middleware/access_controll.js"


function setAccessControl(access_types){
  return (req, res, next)=>{
    return accesscontroll(acc)
  }
}
const router = express.Router();

// router.post("/register",setAccessControl("1"), registerUser);

router.post("/add-user", setAccessControl("1"), addUser);

router.get("/all-users", setAccessControl("1,2"), getAllUsers);

router.put("/update-user/:id", setAccessControl("1,2"), updateUser);

router.delete("/delete-user/:id", setAccessControl("1"), deleteUser);
router.put(
  "/change-password", 
  setAccessControl("1,2"),
    accesscontroll,
  changePassword
);




export default router;