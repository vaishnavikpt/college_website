import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "shree-narayana-guru-college.firebaseapp.com",
  projectId: "shree-narayana-guru-college",
  storageBucket: "shree-narayana-guru-college.firebasestorage.app",
  messagingSenderId: "397492681533",
  appId: "1:397492681533:web:4f70506e99186ee86a354",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);