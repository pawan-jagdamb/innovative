// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "colligiate-mart.firebaseapp.com",
  projectId: "colligiate-mart",
  storageBucket: "colligiate-mart.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: "1:197810158914:web:2a52779dd99b1483fb9cdb",
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);