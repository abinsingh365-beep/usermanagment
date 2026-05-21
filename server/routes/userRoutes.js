import express from "express";

import {
  registerUser,
  addUser,
  getAllUsers,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/add-user", addUser);

router.get("/all-users", getAllUsers);

router.put("/update-user/:id", updateUser);

router.delete("/delete-user/:id", deleteUser);

export default router;