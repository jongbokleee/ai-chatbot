// src/components/Layout.jsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold hover:text-blue-600 transition">
          AI 연인 만들기 
        </Link>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
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
