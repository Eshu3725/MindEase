import { db, doc, setDoc } from './firebase-config.js';

document.addEventListener("DOMContentLoaded", () => {
  const uid = sessionStorage.getItem("uid");
  if (!uid) {
    alert("User not found. Please sign up again.");
    window.location.href = "signup.html";
  }

  document.getElementById("audioVideo").querySelector("button").addEventListener("click", () => {
    savePreference(uid, "audio_video");
  });

  document.getElementById("text").querySelector("button").addEventListener("click", () => {
    savePreference(uid, "text");
  });
});

async function savePreference(uid, preference) {
  try {
    await setDoc(doc(db, "users", uid), {
      preference: preference
    }, { merge: true }); // merge prevents overwriting other fields
    alert("Preference saved successfully!");
    sessionStorage.removeItem("uid"); // optional: clear sessionStorage
    window.location.href = "login.html"; // redirect to login page
  } catch (error) {
    console.error("Error saving preference:", error);
    alert("Could not save preference. Please try again.");
  }
}
