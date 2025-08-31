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

// Get notes for logged-in user (own + shared)
export const getNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const notes = await Note.find({
      $or: [{ createdBy: userId }, { sharedWithReaders: userId }]
    }).populate("createdBy", "name email");

    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notes" });
  }
};

// Update note (only creator)
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (note.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    await note.save();

    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating note" });
  }
};

// Delete note (only creator)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (note.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await note.deleteOne();
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
};

// Share note (add readers)
export const shareNote = async (req, res) => {
  try {
    const { email } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (note.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const userToShare = await User.findOne({ email });
    if (!userToShare) return res.status(404).json({ success: false, message: "User not found" });

    if (!note.sharedWithReaders.includes(userToShare._id)) {
      note.sharedWithReaders.push(userToShare._id);
      await note.save();
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sharing note" });
  }
};
export const getMyNotes = async (req, res) => {
  const notes = await Note.find({ createdBy: req.userId });
  res.json({ notes });
};

export const getSharedNotes = async (req, res) => {
  const notes = await Note.find({ sharedWithReaders: req.userId }).populate("createdBy", "name email");
  res.json({ notes });
};