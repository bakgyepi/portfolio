import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbytr_EmqLx7-b_pQ079i15lWCjKeSlvg",
  authDomain: "blog-55d29.firebaseapp.com",
  projectId: "blog-55d29",
  storageBucket: "blog-55d29.firebasestorage.app",
  messagingSenderId: "428522321698",
  appId: "1:428522321698:web:1782fccd925905a8aed77b",
  measurementId: "G-9TQDL1DYQS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);