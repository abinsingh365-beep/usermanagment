import express from "express";
import { signin } from "../controllers/authcontrollers.js";

const router = express.Router();

router.post("/sign-in", signin);

export default router;