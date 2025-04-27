import React, { useState, useEffect } from "react";
import { collection, addDoc, getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { generatePrompt } from "../utils/generatePrompt";

export default function CreateCharacter() {
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [background, setBackground] = useState("");
  const [relation, setRelation] = useState("");
  const [callName, setCallName] = useState("");
  const [style, setStyle] = useState("친근한");
  const [topicLimit, setTopicLimit] = useState("");
  const [situationExamples, setSituationExamples] = useState("");
  const [sharedMemories, setSharedMemories] = useState("");
  const [profileImages, setProfileImages] = useState([]);
  const [cardImages, setCardImages] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const navigate = useNavigate();

  const db = getFirestore(app);

  useEffect(() => {
    const fetchImages = async () => {
      const profileDoc = await getDoc(doc(db, "defaults", "profileImages"));
      const cardDoc = await getDoc(doc(db, "defaults", "cardImages"));
      if (profileDoc.exists()) setProfileImages(profileDoc.data().images || []);
      if (cardDoc.exists()) setCardImages(cardDoc.data().images || []);
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

    const prompt = generatePrompt({ name, background, style, relation, callName, topicLimit, situationExamples, sharedMemories });

    await addDoc(collection(db, "characters"), {
      name,
      description: intro,
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요 (예: 수아, 하준)"
          className="input input-bordered w-full"
          required
        />
        <input
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="한줄 소개 (예. 상큼발랄 대학생)"
          className="input input-bordered w-full"
          required
        />
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="캐릭터 배경, 직업, 특징 (예: 경영학과 재학 중, 외향적, 커피 매니아)"
          className="textarea textarea-bordered w-full"
          required
        />
        <input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="나와 이 캐릭터의 관계 (예: 사수와 친한 후배)"
          className="input input-bordered w-full"
          required
        />
        <input
          value={callName}
          onChange={(e) => setCallName(e.target.value)}
          placeholder="상대를 부를 때 호칭 (예: 과장님, 지훈 선배)"
          className="input input-bordered w-full"
          required
        />
        <select value={style} onChange={(e) => setStyle(e.target.value)} className="select select-bordered w-full">
          <option>친근한</option>
          <option>무뚝뚝한</option>
          <option>정중한</option>
          <option>유머러스한</option>
        </select>
        <textarea
          value={topicLimit}
          onChange={(e) => setTopicLimit(e.target.value)}
          placeholder="대화할 주제나 제한사항 (예: 정치나 경제 주제는 피하기)"
          className="textarea textarea-bordered w-full"
        />
        <textarea
          value={situationExamples}
          onChange={(e) => setSituationExamples(e.target.value)}
          placeholder="상황 예시 (예: 카페에서 우연히 만났을 때 대화)"
          className="textarea textarea-bordered w-full"
          required
        />
        <textarea
          value={sharedMemories}
          onChange={(e) => setSharedMemories(e.target.value)}
          placeholder="공유된 기억이나 함께한 사건 (예: 같이 프로젝트 했던 기억)"
          className="textarea textarea-bordered w-full"
        />
        <div>
          <h2 className="text-lg font-semibold mb-2">프로필 이미지 선택</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profileImages.map((img) => (
              <img
                key={img.name}
                src={img.url}
                alt={img.name}
                className={`cursor-pointer rounded-lg border-2 w-full h-32 object-cover transition ${selectedProfile === img.url ? "border-blue-500" : "border-transparent"}`}
                onClick={() => handleProfileSelect(img.name)}
              />
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-full mt-8">캐릭터 등록하기</button>
      </form>
    </div>
  );
}
