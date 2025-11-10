// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeAB2Zrxh-YGJxS-S5DxIR1daknZg9E5I",
  authDomain: "min-singkawang-website.firebaseapp.com",
  projectId: "min-singkawang-website",
  storageBucket: "min-singkawang-website.appspot.com",
  messagingSenderId: "26160860019",
  appId: "1:26160860019:web:c6390fba26af450bc59306"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
