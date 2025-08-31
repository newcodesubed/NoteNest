import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";

// Create note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    const note = new Note({
      title,
      content,
      createdBy: req.userId,
    });
    await note.save();

    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating note" });
  }
};