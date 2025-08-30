import express from "express";
import { login, logout, signup, verifyEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signup",signup);
router.post('/verify-email', verifyEmail)
router.get("/login",login);
router.post("/logout",logout);

export default router;