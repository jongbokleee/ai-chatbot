import React, { useState, useEffect } from "react";
import { collection, addDoc, getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function CreateCharacter() {
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [background, setBackground] = useState("");
  const [style, setStyle] = useState("친근한");
  const [speechPatterns, setSpeechPatterns] = useState([]);
  const [frequentPhrases, setFrequentPhrases] = useState("");
  const [topicLimit, setTopicLimit] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [situationExamples, setSituationExamples] = useState("");
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

    // 🧠 프롬프트 텍스트 생성 (구체화)
    const fullPrompt = `너는 ${name}라는 이름의 캐릭터야. ${background} 기본 성격은 ${style}이며, 말투 특징은 ${speechPatterns.join(", ")}을 가지고 있어.  대화 주제는 ${topicLimit || "특정 제한 없음"}을 우선시하고, 상황 예시는 ${situationExamples}이다. 항상 자연스럽고 맥락에 맞는 대화를 이어가야 하며, 뜬금없는 주제 전환은 하지 않는다.`;

    await addDoc(collection(db, "characters"), {
      name,
      description: intro,
      prompt: fullPrompt,
      image: selectedCard,
      profile: selectedProfile,
    });
    navigate("/");
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">➕ 새 캐릭터 만들기</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 기본 정보 */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요 (예: 수아, 하준)"
          className="input input-bordered w-full"
          required
        />
        <input value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="한줄 소개 (예. 상큼발랄 대학생)" className="input input-bordered w-full" required />

        {/* 배경 설정 */}
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="캐릭터 배경, 직업, 특징 (예: 경영학과 재학 중, 외향적, 커피 매니아)"
          className="textarea textarea-bordered w-full"
          required
        />

        {/* 대화 스타일 */}
        <select value={style} onChange={(e) => setStyle(e.target.value)} className="select select-bordered w-full">
          <option>친근한</option>
          <option>무뚝뚝한</option>
          <option>정중한</option>
          <option>유머러스한</option>
        </select>

        {/* 말투 특징 */}
        <div className="space-y-2">
          <label>말투 특징 선택</label>
          <div className="flex flex-wrap gap-2">
            {['반말', '존댓말', '이모티콘 사용', '영어섞기'].map((item) => (
              <button
                type="button"
                key={item}
                className={`px-3 py-1 rounded-full border ${speechPatterns.includes(item) ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                onClick={() =>
                  setSpeechPatterns((prev) =>
                    prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
                  )
                }
              >{item}</button>
            ))}
          </div>
        </div>

        {/* 자주 쓰는 표현 */}
        <textarea
          value={frequentPhrases}
          onChange={(e) => setFrequentPhrases(e.target.value)}
          placeholder="자주 쓰는 표현 (예: ㅋㅋ, ㅎㅎ, 진짜?)"
          className="textarea textarea-bordered w-full"
        />

        {/* 대화 주제 제한 */}
        <textarea
          value={topicLimit}
          onChange={(e) => setTopicLimit(e.target.value)}
          placeholder="대화할 주제나 제한사항 (예: 정치나 경제 주제는 피하기)"
          className="textarea textarea-bordered w-full"
        />

        {/* 자기소개 문구 */}
        <textarea
          value={selfIntro}
          onChange={(e) => setSelfIntro(e.target.value)}
          placeholder="자기소개 문구 (대화 시작시, 예: 안녕! 오랜만이야!)"
          className="textarea textarea-bordered w-full"
        />

        {/* 상황 예시 */}
        <textarea
          value={situationExamples}
          onChange={(e) => setSituationExamples(e.target.value)}
          placeholder="상황 예시 (예: 카페에서 우연히 만났을 때 대화)"
          className="textarea textarea-bordered w-full"
        />

        {/* 프로필 선택 */}
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
