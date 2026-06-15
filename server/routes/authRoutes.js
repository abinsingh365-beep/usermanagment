import express from "express";
import {signin,forgotPasswordReset, forgotPassword} from "../controllers/authControllers.js";
import { addUser,getAllUsers,updateUser,deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/sign-in", signin);
router.put("/forgot-passwordreset", forgotPasswordReset);
router.post("/forgot-password",forgotPassword)





export default router;