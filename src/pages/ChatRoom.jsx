// src/pages/ChatRoom.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../api/firebase";
import { getChatResponse } from "../api/openai"; // OpenAI 연결 함수

export default function ChatRoom() {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      const db = getFirestore(app);
      const docRef = doc(db, "characters", characterId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCharacter(docSnap.data());
      }
    };

    fetchCharacter();
  }, [characterId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { sender: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");

    const aiReply = await getChatResponse(
      updatedMessages.map((msg) => msg.text),
      character.prompt
    );

    setMessages([...updatedMessages, { sender: "ai", text: aiReply }]);
  };

  if (!character) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 프로필 */}
      <div className="flex items-center gap-4 bg-white p-4 shadow">
        <img
          src={character.profile || "https://via.placeholder.com/40"}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <h2 className="text-xl font-bold">{character.name}</h2>
      </div>

      {/* 대화 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-sm p-3 rounded-lg ${
              msg.sender === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-white text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="flex p-4 bg-white border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-l-lg border"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition"
        >
          전송
        </button>
      </div>
    </div>
  );
}
