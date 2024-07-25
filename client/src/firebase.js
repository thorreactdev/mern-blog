// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-5b1de.firebaseapp.com",
  projectId: "mern-blog-5b1de",
  storageBucket: "mern-blog-5b1de.appspot.com",
  messagingSenderId: "361347420757",
  appId: "1:361347420757:web:7ca4f18236cf16a33abadc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);