import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ShareModal({ note, shareEmail, setShareEmail, onClose, onShare }) {
  const handleShare = async () => {
    if (!shareEmail || !shareEmail.includes("@")) return toast.error("Enter a valid email");
    await onShare();
    toast.success(`Shared note with ${shareEmail}`);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-96 relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 className="text-lg font-semibold mb-4">Share Note</h2>
        <input
          type="email"
          placeholder="Recipient Email"
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">
            Cancel
          </button>
          <button onClick={handleShare} className="bg-blue-500 px-3 py-1 rounded text-white">
            Share
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
