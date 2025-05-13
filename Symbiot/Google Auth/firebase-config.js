// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATSN1sAjas0MiKmo6RDMdUCZ1aXZReBus",
  authDomain: "authentication-4e3bb.firebaseapp.com",
  projectId: "authentication-4e3bb",
  storageBucket: "authentication-4e3bb.appspot.com",
  messagingSenderId: "433153429402",
  appId: "1:433153429402:web:2682b2a3ac9eb5d4bab423",
  measurementId: "G-19LMVXM39P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Export Firebase utilities
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  googleProvider,
  signInWithPopup,
  getIdToken
};
