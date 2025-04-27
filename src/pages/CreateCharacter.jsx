import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, getFirestore, addDoc } from "firebase/firestore";
import app from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { seedDefaults } from "../utils/seedDefaults"; // 경로 주의!

export default function CreateCharacter() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [profileImages, setProfileImages] = useState([]);
  const [cardImages, setCardImages] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const navigate = useNavigate();

  const db = getFirestore(app);

  useEffect(() => {
    const fetchImages = async () => {
      // ✅ 최초 1회만 seed (중복 insert 안되게 이미 존재 체크 내장됨)
      await seedDefaults();

      const profileDoc = await getDoc(doc(db, "defaults", "profileImages"));
      const cardDoc = await getDoc(doc(db, "defaults", "cardImages"));

      if (profileDoc.exists()) {
        setProfileImages(profileDoc.data().images || []);
      }
      if (cardDoc.exists()) {
        setCardImages(cardDoc.data().images || []);
      }
    };
    fetchImages();
  }, []);

  const handleProfileSelect = (characterName) => {
    const profile = profileImages.find((img) => img.name === characterName);
    const card = cardImages.find((img) => img.name === characterName);
    setSelectedProfile(profile?.url || "");
    setSelectedCard(card?.url || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProfile || !selectedCard) {
      alert("프로필 이미지를 선택해주세요!");
      return;
    }
    await addDoc(collection(db, "characters"), {
      name,
      description,
      prompt,
      image: selectedCard,
      profile: selectedProfile,
    });
    navigate("/");
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">➕ 새 캐릭터 만들기</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="input input-bordered w-full"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명"
          className="textarea textarea-bordered w-full"
          required
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="프롬프트"
          className="textarea textarea-bordered w-full"
          required
        />

        <div>
          <h2 className="text-lg font-semibold mb-2">프로필 이미지 선택</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profileImages.map((img) => (
              <img
                key={img.name}
                src={img.url}
                alt={img.name}
                className={`cursor-pointer rounded-lg border-2 w-full h-32 object-cover transition ${
                  selectedProfile === img.url ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => handleProfileSelect(img.name)}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-8">
          캐릭터 등록하기
        </button>
      </form>
    </div>
  );
}
