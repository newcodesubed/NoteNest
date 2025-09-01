import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNoteStore } from "../store/noteStore";
import DashboardHeader from "../components/DashboardHeader";
import Tabs from "../components/Tabs";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";
import ShareModal from "../components/ShareModal";
import { motion, AnimatePresence } from "framer-motion";

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
  } = useNoteStore();

  const [activeTab, setActiveTab] = useState("myNotes");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  const NOTES_PER_PAGE = 5;

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const sharedCount = useMemo(() => sharedNotes.length, [sharedNotes]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const openShareModal = (note) => {
    setNoteToShare(note);
    setShareEmail("");
    setShareModalOpen(true);
  };

  const handleShare = async () => {
    try {
      await shareNote(noteToShare._id, shareEmail);
      toast.success("Note shared successfully!");
    } catch (err) {
      toast.error("Failed to share note.",err);
    } finally {
      setShareModalOpen(false);
    }
  };

  // Filter + Paginate
  const filteredNotes = useMemo(() => {
    const list = activeTab === "myNotes" ? notes : sharedNotes;
    return list.filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [notes, sharedNotes, activeTab, search]);

  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE) || 1;
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Toaster position="top-right" />
      <DashboardHeader user={user} onLogout={handleLogout} />
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sharedCount={sharedCount}
      />

      {/* Search */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />
      </div>

      {/* My Notes */}
      {activeTab === "myNotes" && !isLoading && (
        <div className="min-h-[200px]">
          <NoteForm onSubmit={createNote} />
          <ul className="space-y-3">
            {paginatedNotes.map((note) => (
              <NoteItem
                key={note._id}
                note={note}
                updateNote={updateNote}
                deleteNote={deleteNote}
                openShareModal={openShareModal}
              />
            ))}
          </ul>
          {filteredNotes.length === 0 && (
            <p className="text-gray-500">No notes yet.</p>
          )}
        </div>
      )}

      {/* Shared Notes */}
      {activeTab === "sharedNotes" && !isLoading && (
        <div className="min-h-[200px]">
          {filteredNotes.length === 0 ? (
            <p className="text-gray-500">No notes shared with you yet.</p>
          ) : (
            <ul className="space-y-3">
              {paginatedNotes.map((note) => (
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

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <ShareModal
            note={noteToShare}
            shareEmail={shareEmail}
            setShareEmail={setShareEmail}
            onClose={() => setShareModalOpen(false)}
            onShare={handleShare}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
