import React from "react";

export default function DashboardHeader({ user, onLogout }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <img src="/logo.webp
        " alt="Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold">Welcome, {user?.name || "User"} 👋</h1>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
