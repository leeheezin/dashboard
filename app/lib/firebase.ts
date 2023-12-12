// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import dotenv from 'dotenv';
import { getFirestore } from "firebase/firestore";
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGEIN_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed up:", user.uid);
        return user;
    } catch (error: unknown) {
        if (error) {
            console.error();
        } else {
            console.error("Unknown Error signing up:", error);
        }
        throw error;
    }
};

const signInWithPassword = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user);
        return user;
    } catch (error: unknown) {
        // FirebaseError 타입인지 확인하고 처리
        if (error) {
            console.error();
        } else {
            console.error("Unknown Error signing in:", error);
        }
        throw error;
    }
};
const db = getFirestore(app)
export { auth, signUp, signInWithPassword, db };
