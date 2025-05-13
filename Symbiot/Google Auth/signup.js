/* The `import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from './firebase-config.js';`
statement is importing specific functions and objects from a module located at
'./firebase-config.js'. In this case, it is importing the `auth` object, `db` object,
`createUserWithEmailAndPassword` function, `doc` function, and `setDoc` function from the
'firebase-config.js' module. These functions and objects are likely related to Firebase
authentication and Firestore database operations, allowing the code to interact with Firebase
services for user authentication and data storage. */
import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from './firebase-config.js';

const signupForm = document.getElementById('signupForm');
const errorDisplay = document.getElementById('signupError');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const course = document.getElementById('course').value.trim();
  const gender = document.getElementById('gender').value;
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullname,
      course,
      gender,
      email,
      uid: user.uid,
      createdAt: new Date()
    });

    // Store UID for preferences page
    sessionStorage.setItem("uid", user.uid);

    // Redirect to preferences page
    window.location.href = "preferences.html";

  } catch (error) {
    errorDisplay.textContent = error.message;
  }
});
