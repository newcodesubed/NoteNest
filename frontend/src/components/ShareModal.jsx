import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";

export default function ShareModal({ note, shareEmail, setShareEmail, onClose, onShare }) {
  const inputRef = useRef(null);
  const backdropRef = useRef(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleShare = async () => {
    if (!shareEmail || !shareEmail.includes("@")) {
      return toast.error("Enter a valid email");
    }
    await onShare();
    setSuccess(true);
    toast.success(`Shared note with ${shareEmail}`);

    // Auto-close modal after 1.5s
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-96 shadow-xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-lg font-semibold mb-4">Share Note</h2>
              <input
                ref={inputRef}
                type="email"
                placeholder="Recipient Email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="border p-2 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition"
                >
                  Share
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="flex flex-col items-center justify-center py-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="text-green-500 w-16 h-16 mb-2" />
              <p className="text-lg font-semibold text-green-600">Note Shared!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
