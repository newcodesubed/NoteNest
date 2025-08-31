import express from "express";

import { createNote, deleteNote, getMyNotes, getNotes, getSharedNotes, shareNote, updateNote } from "../controllers/note.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createNote);
router.get("/", verifyToken, getNotes);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);
router.post("/:id/share", verifyToken, shareNote);
router.get("/my-notes", verifyToken, getMyNotes);
router.get("/shared-with-me", verifyToken, getSharedNotes);
export default router;