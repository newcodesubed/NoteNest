import express from "express";

import { createNote, getNotes, updateNote, deleteNote, shareNote } from "../controllers/note.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createNote);
router.get("/", verifyToken, getNotes);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);
router.post("/:id/share", verifyToken, shareNote);

export default router;