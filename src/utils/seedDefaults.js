// src/utils/seedDefaults.js
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore"; // ✅ getDoc 추가!!
import app from "../api/firebase";

export async function seedDefaults() {
    const db = getFirestore(app);

    const profileDoc = doc(db, "defaults", "profileImages");
    const profileSnap = await getDoc(profileDoc);

    if (profileSnap.exists()) {
        console.log("✅ 기본 데이터가 이미 존재합니다. seedDefaults 실행 안함.");
        return;
    }
  
    // 프로필 이미지 데이터
    const profileImages = [
      { name: "수아", url: "https://raw.githubusercontent.com/jongbokleee/ai-chatbot/main/public/images/sua.png" },
      { name: "지은", url: "https://raw.githubusercontent.com/jongbokleee/ai-chatbot/main/public/images/jieun.png" },
      { name: "하준", url: "https://raw.githubusercontent.com/jongbokleee/ai-chatbot/main/public/images/hajun.png" },
      { name: "세진", url: "https://raw.githubusercontent.com/jongbokleee/ai-chatbot/main/public/images/sejin.png" },
    ];

    // 카드 이미지 데이터
    const cardImages = [
      { name: "수아", url: "/images/sua.png" },
      { name: "지은", url: "/images/jieun.png" },
      { name: "하준", url: "/images/hajun.png" },
      { name: "세진", url: "/images/sejin.png" },
    ];

    try {
      await setDoc(doc(db, "defaults", "profileImages"), { images: profileImages });
      await setDoc(doc(db, "defaults", "cardImages"), { images: cardImages });
      console.log("✅ 기본 이미지 데이터가 Firestore에 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("❌ Firestore에 저장 실패:", error);
    }
}
