// pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNoteStore } from "../store/noteStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    notes,
    sharedNotes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    isLoading,
    error,
  } = useNoteStore();

  const [activeTab, setActiveTab] = useState("myNotes");

  // Form state for creating new note
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit mode state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) return alert("Title must be at least 3 characters");
    await createNote(title, content);
    setTitle("");
    setContent("");
  };

  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (noteId) => {
    if (editTitle.trim().length < 3) return alert("Title must be at least 3 characters");
    await updateNote(noteId, editTitle, editContent);
    setEditingNoteId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.name || "User"} 👋
      </h1>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "myNotes"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("myNotes")}
        >
          My Notes
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "sharedNotes"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("sharedNotes")}
        >
          Shared With Me
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading */}
      {isLoading && <p>Loading notes...</p>}

      {/* My Notes */}
      {activeTab === "myNotes" && !isLoading && (
        <div>
          {/* Create Note Form */}
          <form onSubmit={handleCreate} className="mb-6 space-y-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Note
            </button>
          </form>

          {/* List Notes */}
          {notes.length === 0 ? (
            <p className="text-gray-500">You haven’t created any notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row md:justify-between gap-2"
                >
                  {/* Edit Mode */}
                  {editingNoteId === note._id ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border p-2 w-full rounded"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="border p-2 w-full rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(note._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="bg-gray-300 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h2 className="font-semibold">{note.title}</h2>
                      <p className="text-gray-600">{note.content}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {editingNoteId !== note._id && (
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => startEdit(note)}
                        className="bg-yellow-400 px-3 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="bg-red-500 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Shared Notes */}
      {activeTab === "sharedNotes" && !isLoading && (
        <div>
          {sharedNotes.length === 0 ? (
            <p className="text-gray-500">No notes shared with you yet.</p>
          ) : (
            <ul className="space-y-3">
              {sharedNotes.map((note) => (
                <li
                  key={note._id}
                  className="p-4 bg-white rounded-lg shadow"
                >
                  <h2 className="font-semibold">{note.title}</h2>
                  <p className="text-gray-600">{note.content}</p>
                  <p className="text-sm text-gray-400">
                    Shared by {note.createdBy?.name || "Unknown"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
