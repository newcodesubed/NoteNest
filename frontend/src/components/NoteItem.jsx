import React, { useState } from "react";
import toast from "react-hot-toast";

export default function NoteItem({ note, updateNote, deleteNote, openShareModal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleUpdate = async () => {
    if (editTitle.trim().length < 3) return toast.error("Title must be at least 3 chars");
    await updateNote(note._id, editTitle, editContent);
    setIsEditing(false);
  };

  return (
    <li className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row md:justify-between gap-2">
      {isEditing ? (
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
              onClick={handleUpdate}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
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

      {!isEditing && (
        <div className="flex flex-col gap-2 mt-2 md:mt-0">
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
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
  );
}
