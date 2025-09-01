import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNoteStore } from "../store/noteStore";
import DashboardHeader from "../components/DashboardHeader";
import Tabs from "../components/Tabs";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";
import ShareModal from "../components/ShareModal";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { notes, sharedNotes, fetchNotes, createNote, updateNote, deleteNote, shareNote, isLoading } = useNoteStore();

  const [activeTab, setActiveTab] = useState("myNotes");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  useEffect(() => { fetchNotes(); }, [fetchNotes]);
  const sharedCount = useMemo(() => sharedNotes.length, [sharedNotes]);

  const handleLogout = async () => { await logout(); navigate("/login"); };
  const openShareModal = (note) => { setNoteToShare(note); setShareEmail(""); setShareModalOpen(true); };
  const handleShare = async () => { await shareNote(noteToShare._id, shareEmail); setShareModalOpen(false); };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Toaster position="top-right" />
      <DashboardHeader user={user} onLogout={handleLogout} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} sharedCount={sharedCount} />

      {activeTab === "myNotes" && !isLoading && (
        <div className="min-h-[200px]">
          <NoteForm onSubmit={createNote} />
          <ul className="space-y-3">
            {notes.map(note => (
              <NoteItem key={note._id} note={note} updateNote={updateNote} deleteNote={deleteNote} openShareModal={openShareModal} />
            ))}
          </ul>
          {notes.length === 0 && <p className="text-gray-500 text-center">No notes yet.</p>}
        </div>
      )}

      {activeTab === "sharedNotes" && !isLoading && (
        <div className="min-h-[200px]">
          {sharedNotes.length === 0
            ? <p className="text-gray-500 text-center">No notes shared with you yet.</p>
            : <ul className="space-y-3">
                {sharedNotes.map(note => (
                  <li key={note._id} className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-semibold">{note.title}</h2>
                    <p className="text-gray-600">{note.content}</p>
                    <p className="text-sm text-gray-400">Shared by {note.createdBy?.name || "Unknown"}</p>
                  </li>
                ))}
              </ul>
          }
        </div>
      )}

      {shareModalOpen && (
        <ShareModal
          note={noteToShare}
          shareEmail={shareEmail}
          setShareEmail={setShareEmail}
          onClose={() => setShareModalOpen(false)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
