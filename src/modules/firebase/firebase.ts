import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

initializeApp(
{
  apiKey: "AIzaSyCVgkErFLhc-N2ALsyD5yxGoIYNInyPZ_o",
  authDomain: "music-plactice-record.firebaseapp.com",
  projectId: "music-plactice-record",
  storageBucket: "music-plactice-record.appspot.com",
  messagingSenderId: "1073962219409",
  appId: "1:1073962219409:web:7d78ede1cbd5e646ef0c30"
});

export const auth = getAuth();
export const db = getFirestore();
export const firestorage = getStorage();

