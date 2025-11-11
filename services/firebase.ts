// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase untuk proyek website-minskw
const firebaseConfig = {
  apiKey: "AIzaSyDeeKAGFxCxpvbrlTF8ia956Z2JIQyT_g8",
  authDomain: "website-minskw.firebaseapp.com",
  projectId: "website-minskw",
  storageBucket: "website-minskw.appspot.com",
  messagingSenderId: "950097325487",
  appId: "1:950097325487:web:71085e538d08df7b98d35a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);
