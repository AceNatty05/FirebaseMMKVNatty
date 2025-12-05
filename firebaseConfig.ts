// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCM2o0TyB1-2ZT2nM5QGJ9Ai8AmedJcNs",
  authDomain: "pbp-firebaseauthentication.firebaseapp.com",
  projectId: "pbp-firebaseauthentication",
  storageBucket: "pbp-firebaseauthentication.firebasestorage.app",
  messagingSenderId: "978781581002",
  appId: "1:978781581002:web:3efa80d1eba9036ad28e33",
  measurementId: "G-KMB0BJ724F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);