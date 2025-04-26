// src/pages/Main.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../api/firebase";

export default function Main() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "characters"));
      const characterList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCharacters(characterList);
    };

    fetchCharacters();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">🎯 AI 연인 선택하기</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {/* (1) 등록된 캐릭터들 */}
        {characters.map((character) => (
          <div
            key={character.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition cursor-pointer flex flex-col items-center text-center"
          >
            <img
              src={character.image || "https://via.placeholder.com/200x250.png?text=No+Image"}
              alt={character.name}
              className="rounded-xl w-48 h-60 object-cover mb-4"
            />
            <h2 className="text-xl font-bold">{character.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{character.description}</p>
            <Link
              to={`/chat/${character.id}`}
              className="bg-blue-500 text-white rounded-full px-4 py-2 text-sm hover:bg-blue-600 transition"
            >
              {character.name} 선택하기 →
            </Link>
          </div>
        ))}

        {/* (2) ➕ 새 캐릭터 추가 카드 */}
        <div
          className="bg-gray-100 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 hover:border-blue-400 hover:bg-gray-50 transition cursor-pointer"
        >
          <Link to="/create" className="flex flex-col items-center">
            <div className="text-5xl mb-4">➕</div>
            <div className="text-xl font-bold text-gray-700">새 캐릭터 추가하기</div>
          </Link>
        </div>

      </div>
    </div>
  );
}
