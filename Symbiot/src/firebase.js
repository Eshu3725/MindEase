// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  getIdToken
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc
} from "firebase/firestore";

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

// Initialize Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Facebook provider with custom parameters
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');
// Add custom parameters for Facebook login
facebookProvider.setCustomParameters({
  'display': 'popup'
});

// Twitter provider with custom parameters
const twitterProvider = new TwitterAuthProvider();
// Add custom parameters for Twitter login
twitterProvider.setCustomParameters({
  'lang': 'en'
});

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  googleProvider,
  facebookProvider,
  twitterProvider,
  signInWithPopup,
  getIdToken
};
