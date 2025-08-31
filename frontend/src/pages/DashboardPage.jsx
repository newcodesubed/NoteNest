
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNoteStore } from "../store/noteStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { notes, sharedNotes, fetchNotes, isLoading, error } = useNoteStore();
  const [activeTab, setActiveTab] = useState("myNotes");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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

      {/* Content */}
      {isLoading ? (
        <p>Loading notes...</p>
      ) : activeTab === "myNotes" ? (
        <div>
          {notes.length === 0 ? (
            <p className="text-gray-500">You haven’t created any notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note._id} className="p-4 bg-white rounded-lg shadow">
                  <h2 className="font-semibold">{note.title}</h2>
                  <p className="text-gray-600">{note.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          {sharedNotes.length === 0 ? (
            <p className="text-gray-500">No notes shared with you yet.</p>
          ) : (
            <ul className="space-y-3">
              {sharedNotes.map((note) => (
                <li key={note._id} className="p-4 bg-white rounded-lg shadow">
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
