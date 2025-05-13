import {
  auth,
  signInWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
  getIdToken
} from './firebase-config.js';

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const googleSignInButton = document.getElementById('googleSignIn');

// Email/Password Sign In
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get the ID token for backend authentication
    const idToken = await getIdToken(user);

    // Store token in localStorage for API requests
    localStorage.setItem("authToken", idToken);
    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0]
    }));

    alert('Login successful!');
    window.location.href = "dashboard.html"; // Change to your actual dashboard

  } catch (error) {
    loginError.textContent = error.message;
  }
});

// Google Sign In
async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Get the ID token for backend authentication
    const idToken = await getIdToken(user);

    // Store token in localStorage for API requests
    localStorage.setItem("authToken", idToken);
    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL
    }));

    // Check if user exists in Firestore, if not create a new record
    // This would typically be handled by a backend API

    alert('Google Sign-In successful!');
    window.location.href = "dashboard.html"; // Change to your actual dashboard
  } catch (error) {
    loginError.textContent = error.message;
  }
}

// Add click event listener to Google Sign In button
document.addEventListener('DOMContentLoaded', () => {
  const googleButton = document.querySelector('.social-icons a:nth-child(3)');
  if (googleButton) {
    googleButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleGoogleSignIn();
    });
  }
});
