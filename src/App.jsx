import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Main from './pages/Main';
import CreateCharacter from "./pages/CreateCharacter";
import ChatRoom from "./pages/ChatRoom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<CreateCharacter />} />
        <Route path="/chat/:characterId" element={<ChatRoom />} />
        </Route>
      </Routes>
    </Router>
  );
}
