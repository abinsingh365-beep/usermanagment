import express from "express";

import {
  registerUser,
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword
} from "../controllers/userController.js";
import accesscontroll from "../utils/access_control_data.js";
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/register", registerUser);

router.post("/add-user", addUser);

router.get("/all-users", getAllUsers);

router.put("/update-user/:id", updateUser);

router.delete("/delete-user/:id", deleteUser);
router.put(
    "/change-password",
    protect,
    changePassword
);




export default router;