'use client'; 

import { useState } from "react";
import { signUp } from "../lib/firebase";
import { useRouter } from "next/router";

export default function SignUP() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignup = async () => {
    try {
      await signUp(email, password);
      // 회원가입 성공 시 원하는 동작 수행
    } catch (error) {
      // 회원가입 실패 시 에러 처리
      console.error("회원가입 에러:", error);
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};
