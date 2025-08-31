import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";
axios.defaults.withCredentials = true;

export const useNoteStore = create((set, get) => ({
  notes: [],
  sharedNotes: [],
  isLoading: false,
  error: null,

  // Fetch all notes
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const [myRes, sharedRes] = await Promise.all([
        axios.get(`${API_URL}/my-notes`),
        axios.get(`${API_URL}/shared-with-me`),
      ]);

      set({
        notes: myRes.data.notes,
        sharedNotes: sharedRes.data.notes,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching notes",
        isLoading: false,
      });
    }
  },

  // Create note
  createNote: async (title, content) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(API_URL, { title, content });
      set({ notes: [...get().notes, res.data.note], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error creating note", isLoading: false });
    }
  },

  // Update note
  updateNote: async (id, title, content) => {
    set({ isLoading: true });
    try {
      const res = await axios.put(`${API_URL}/${id}`, { title, content });
      set({
        notes: get().notes.map((n) => (n._id === id ? res.data.note : n)),
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error updating note", isLoading: false });
    }
  },

  // Delete note
  deleteNote: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set({ notes: get().notes.filter((n) => n._id !== id), isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error deleting note", isLoading: false });
    }
  },

  // Share note with optimistic update
  shareNote: async (id, email) => {
    const { notes, sharedNotes } = get();
    const noteToShare = notes.find((n) => n._id === id);
    if (!noteToShare) return;

    // Optimistic update: add a copy to sharedNotes
    set({
      sharedNotes: [...sharedNotes, { ...noteToShare, sharedWith: email }],
    });

    try {
      const res = await axios.post(`${API_URL}/${id}/share`, { email });

      // Update the note in my notes array if backend returns updated note
      set({
        notes: get().notes.map((n) => (n._id === id ? res.data.note : n)),
      });
    } catch (err) {
      // Revert optimistic update if error
      set({
        sharedNotes: get().sharedNotes.filter((n) => n._id !== id),
        error: err.response?.data?.message || "Error sharing note",
      });
    }
  },
}));
