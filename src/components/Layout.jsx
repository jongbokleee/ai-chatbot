import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold hover:text-blue-600 transition">
          AI 연인 만들기
        </Link>
      </nav>

      <main className="flex-grow p-8">
        <Outlet />
      </main>

      <footer className="bg-white shadow-inner text-center text-sm text-gray-500 py-4">
        ⓒ 2025 Chatbot Lab. All rights reserved.
      </footer>
    </div>
  );
}
