// pages/DashboardPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import { useNoteStore } from "../store/noteStore";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    notes,
    sharedNotes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    isLoading,
    error,
  } = useNoteStore();

  const [activeTab, setActiveTab] = useState("myNotes");

  // Create note form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit note state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Share modal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Derived state: shared count
  const sharedCount = useMemo(() => sharedNotes.length, [sharedNotes]);

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Create note
  const handleCreate = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) return alert("Title must be at least 3 chars");
    await createNote(title, content);
    setTitle("");
    setContent("");
  };

  // Start editing
  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // Update note
  const handleUpdate = async (noteId) => {
    if (editTitle.trim().length < 3) return alert("Title must be at least 3 chars");
    await updateNote(noteId, editTitle, editContent);
    setEditingNoteId(null);
  };

  // Open share modal
  const openShareModal = (note) => {
    setNoteToShare(note);
    setShareEmail("");
    setShareModalOpen(true);
  };

  // Share note
  const handleShare = async () => {
    if (!shareEmail || !shareEmail.includes("@")) return alert("Enter a valid email");
    await shareNote(noteToShare._id, shareEmail);
    setShareModalOpen(false);
    setNoteToShare(null);
    setShareEmail("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src="/logo.webp" alt="Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Welcome, {user?.name || "User"} 👋</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "myNotes" ? "border-b-2 border-blue-500 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("myNotes")}
        >
          My Notes
        </button>
        <button
          className={`px-4 py-2 relative ${
            activeTab === "sharedNotes" ? "border-b-2 border-blue-500 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("sharedNotes")}
        >
          Shared With Me
          {sharedCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 rounded-full">
              {sharedCount}
            </span>
          )}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading */}
      {isLoading && <p>Loading notes...</p>}

      {/* My Notes */}
      {activeTab === "myNotes" && !isLoading && (
        <div className="min-h-[200px]">
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Note
            </button>
          </form>

          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">You haven’t created any notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row md:justify-between gap-2"
                >
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

                  {editingNoteId !== note._id && (
                    <div className="flex flex-col gap-2 mt-2 md:mt-0">
                      <div className="flex gap-2">
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
                      <button
                        onClick={() => openShareModal(note)}
                        className="bg-blue-500 px-3 py-1 rounded text-white"
                      >
                        Share
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
        <div className="min-h-[200px]">
          {sharedNotes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes shared with you yet.</p>
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

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-lg font-semibold mb-4">Share Note</h2>
            <input
              type="email"
              placeholder="Recipient Email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShareModalOpen(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="bg-blue-500 px-3 py-1 rounded text-white"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
