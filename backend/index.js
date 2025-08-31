import express from "express";
import dotenv from "dotenv";
import cors from "cors"

import cookieParser from 'cookie-parser';

import { connectDB } from "./db/connectDB.js";
import authRoutes from './routes/auth.route.js';
import noteRoutes from "./routes/note.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin:"http://localhost:5173", credentials: true}))


app.use(express.json());//allow json data in request body:req.body
app.use(cookieParser());//allow us to parse incoming cookies in request


app.get("/",(req,res)=>{
    res.send("Hello World 1234");
})

app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes);

app.listen(PORT,()=>{
    connectDB();
  console.log('Server is running on port :', PORT);
})

