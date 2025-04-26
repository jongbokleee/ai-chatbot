import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import app from "../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getChatResponse } from "../api/openai";

function ChatRoom() {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      const docRef = doc(app, "characters", characterId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCharacter(docSnap.data());
      }
    };
    fetchCharacter();
  }, [characterId]);

  const handleSend = async () => {
    const updatedMessages = [...messages, input];
    setMessages(updatedMessages);
    setInput("");
    const aiReply = await getChatResponse(updatedMessages, character.prompt);
    setMessages([...updatedMessages, aiReply]);
  };

  if (!character) return <div>Loading...</div>;

  return (
    <div>
      <h1>❤️ {character.name}와 대화하기</h1>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "10px 0" }}>{msg}</div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="메시지 입력" />
      <button onClick={handleSend}>전송</button>
    </div>
  );
}

export default ChatRoom;