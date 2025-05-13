import { auth } from './firebase-config.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const resetForm = document.getElementById('resetForm');
const message = document.getElementById('message');
const error = document.getElementById('error');

resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();

  try {
    await sendPasswordResetEmail(auth, email);
    message.textContent = "A password reset link has been sent to your email.";
    error.textContent = "";
  } catch (err) {
    message.textContent = "";
    error.textContent = err.message;
  }
});