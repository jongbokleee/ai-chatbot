// src/pages/CreateCharacter.jsx
import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function CreateCharacter() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const db = getFirestore(app);
    await addDoc(collection(db, "characters"), {
      name,
      description,
      prompt,
      image: image || "https://via.placeholder.com/200x250.png?text=No+Image",
      profile: profile || "https://via.placeholder.com/40x40.png?text=No+Profile"
    });

    alert("✅ 캐릭터가 성공적으로 추가되었습니다!");
    navigate("/");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">➕ 새 캐릭터 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">이름</label>
          <input
            type="text"
            className="w-full p-3 rounded border"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 수아 (ENFP)"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">설명</label>
          <textarea
            className="w-full p-3 rounded border"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="캐릭터 설명"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">프롬프트</label>
          <textarea
            className="w-full p-3 rounded border"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="OpenAI 대화 스타일 (ex: 밝고 긍정적인 말투)"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">프로필 이미지 URL</label>
          <input
            type="text"
            className="w-full p-3 rounded border"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder="40x40 아이콘 URL (없으면 기본 제공)"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">대표 이미지 URL</label>
          <input
            type="text"
            className="w-full p-3 rounded border"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="200x250 메인 카드 이미지 URL (없으면 기본 제공)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
        >
          캐릭터 등록하기
        </button>
      </form>
    </div>
  );
}
