import express from "express";
import { signin, forgotPasswordReset, forgotPassword } from "../controllers/authControllers.js";
import { addUser, getAllUsers, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/sign-in", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", forgotPasswordReset);





export default router;