import React, { useState } from "react";
import toast from "react-hot-toast";

export default function NoteForm({ onSubmit, initialTitle = "", initialContent = "" }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) return toast.error("Title must be at least 3 chars");
    await onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
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
  );
}
