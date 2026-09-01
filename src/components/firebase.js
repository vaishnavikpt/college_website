import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";const firebaseConfig = {
  apiKey: "AIzaSyBbNJGwidmX6EUVPj8boqwCGQTxX1QKqNY",
  authDomain: "shree-narayana-guru-college.firebaseapp.com",
  projectId: "shree-narayana-guru-college",
  storageBucket: "shree-narayana-guru-college.firebasestorage.app",
  messagingSenderId: "397492681533",
  appId: "1:397492681533:web:4f70506fe99186ee86a354",
  measurementId: "G-RT3BP18G97",};const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);export const db = getFirestore(app);