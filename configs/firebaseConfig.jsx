// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "app.snapshort.io",
  projectId: "ai-short-video-generator-eefec",
  storageBucket: "ai-short-video-generator-eefec.firebasestorage.app",
  messagingSenderId: "491074912236",
  appId: "1:491074912236:web:c1801d1c6eeb1f3a3bcac9",
  measurementId: "G-VPRBEDJY8J"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth=getAuth(app);