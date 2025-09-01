import React from "react";

export default function Tabs({ activeTab, setActiveTab, sharedCount }) {
  return (
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
  );
}
