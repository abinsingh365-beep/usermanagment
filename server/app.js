import dotenv from "dotenv";
dotenv.config();

import errorHandler from "./middleware/errorHandler.js";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import mongoConnect from "./db/mongoConnect.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cors from "cors";

const app = express();



// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("your server is live...")
})


// Database
mongoConnect();


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);


// Uploads folder  
app.use("/uploads", express.static(path.join(__dirname,"uploads")));


// Client static folder
app.use(
    express.static(
        path.join(__dirname, "../client")
    )
);


// Home Route
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../client/index.html")
    );

});


// Error Handler
app.use(errorHandler);


// Server
app.listen(process.env.PORT, () => {

    console.log(
        `Server running at http://localhost:${process.env.PORT}`
    );

});