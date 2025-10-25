
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "snapshort-saas.firebaseapp.com",
  projectId: "snapshort-saas",
  storageBucket: "snapshort-saas.firebasestorage.app",
  messagingSenderId: "145049913807",
  appId: "1:145049913807:web:7a2a11e54829116e706aba",
  measurementId: "G-L2GHPXHR86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
