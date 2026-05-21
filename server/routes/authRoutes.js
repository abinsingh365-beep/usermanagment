import express from "express";
import {signin} from "../controllers/authControllers.js";
import { addUser,getAllUsers,updateUser,deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/sign-in", signin);




export default router;