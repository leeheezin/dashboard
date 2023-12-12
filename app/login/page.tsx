'use client'; 

import { useEffect, useState } from "react";
import { auth, signInWithPassword } from "../lib/firebase"; 
import { useRouter } from "next/navigation";
import Todo from "../todo/page";
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';

interface User {
  uid: string;
  email: string;
}
export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser: FirebaseUser | null) => {
      if (loggedInUser) {
        const userData: User = {
          uid: loggedInUser.uid,
          email: loggedInUser.email || '', 
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const loggedInUser: FirebaseUser = await signInWithPassword(email, password);
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <>
      {user ? (
        <div>
        <p>환영합니다, {user.email} 님!</p>
        <button onClick={handleLogout}>Logout</button>
        <Todo user={user} setUser={setUser} />
      </div>
      ) : (
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </>
  );
}
