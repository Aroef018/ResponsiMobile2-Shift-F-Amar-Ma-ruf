// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD2JpAdyHpGlUgmwxRIOX3MWb-UiOsM7XY",
    authDomain: "pemob-a843c.firebaseapp.com",
    projectId: "pemob-a843c",
    storageBucket: "pemob-a843c.firebasestorage.app",
    messagingSenderId: "166416820723",
    appId: "1:166416820723:web:63cf9a442b6d4f25264a86",
    measurementId: "G-W8FGNW7D82"
  };

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };