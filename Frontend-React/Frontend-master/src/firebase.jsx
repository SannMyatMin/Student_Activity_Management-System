import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAshHkCQjXXXcYkWqu_nXJCrvktqYDOEvY",
  authDomain: "uitproject-40592.firebaseapp.com",
  projectId: "uitproject-40592",
  storageBucket: "uitproject-40592.firebasestorage.app",
  messagingSenderId: "235127338056",
  appId: "1:235127338056:web:3a1528a15169d8aa44947d",
  measurementId: "G-RLB11W7D0Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, onSnapshot };
