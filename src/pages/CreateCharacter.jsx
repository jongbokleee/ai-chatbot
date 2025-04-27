import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function CreateCharacter() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const db = getFirestore(app); // ✅ 여기서 직접 db 생성
    const characterData = {
      name,
      description,
      prompt,
      profile: profileImage || "https://via.placeholder.com/40",
      image: mainImage || "https://via.placeholder.com/200x250",
    };

    try {
      await addDoc(collection(db, "characters"), characterData); // ✅ db를 직접 collection에 연결
      alert("✅ 캐릭터가 성공적으로 등록되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("❌ 캐릭터 등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">➕ 새 캐릭터 만들기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" className="w-full p-2 border rounded" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" className="w-full p-2 border rounded" required />
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="프롬프트" className="w-full p-2 border rounded" required />
        <input type="text" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="프로필 이미지 URL" className="w-full p-2 border rounded" />
        <input type="text" value={mainImage} onChange={(e) => setMainImage(e.target.value)} placeholder="대표 이미지 URL" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">캐릭터 등록하기</button>
      </form>
    </div>
  );
}
