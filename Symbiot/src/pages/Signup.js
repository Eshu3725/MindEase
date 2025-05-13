import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  googleProvider,
  facebookProvider,
  twitterProvider,
  signInWithPopup,
  getIdToken
} from '../firebase';
import AuthLayout from '../components/AuthLayout';
import coursesList from '../utils/coursesList';
import SearchableDropdown from '../components/SearchableDropdown';
import { formatAuthError } from '../utils/authHelpers';

const Signup = () => {
  const [fullname, setFullname] = useState('');
  const [course, setCourse] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Create user with email and password
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
      navigate('/preferences');
    } catch (error) {
      console.error("Email/password signup error:", error);
      setError(formatAuthError(error));
    }
  };

  // Handle social media signup
  const handleSocialSignup = async (provider) => {
    try {
      setError('');

      // Check if the provider is properly configured
      if (provider === facebookProvider || provider === twitterProvider) {
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;

          // Check if user data already exists in Firestore
          const userRef = doc(db, "users", user.uid);

          // Save user data in Firestore if it's a new user
          await setDoc(userRef, {
            fullname: user.displayName || '',
            email: user.email || '',
            uid: user.uid,
            photoURL: user.photoURL || '',
            createdAt: new Date(),
            provider: provider.providerId
          }, { merge: true });

          // Get the ID token for backend authentication
          const idToken = await getIdToken(user);

          // Store token in localStorage for API requests
          localStorage.setItem("authToken", idToken);

          // Store UID for preferences page
          sessionStorage.setItem("uid", user.uid);

          // Redirect to preferences page
          navigate('/preferences');
        } catch (socialError) {
          console.error("Social signup error:", socialError);

          // Use the helper function to format the error message
          setError(formatAuthError(socialError));
        }
      } else {
        // For Google or other providers
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user data already exists in Firestore
        const userRef = doc(db, "users", user.uid);

        // Save user data in Firestore if it's a new user
        await setDoc(userRef, {
          fullname: user.displayName || '',
          email: user.email || '',
          uid: user.uid,
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          provider: provider.providerId
        }, { merge: true });

        // Get the ID token for backend authentication
        const idToken = await getIdToken(user);

        // Store token in localStorage for API requests
        localStorage.setItem("authToken", idToken);

        // Store UID for preferences page
        sessionStorage.setItem("uid", user.uid);

        // Redirect to preferences page
        navigate('/preferences');
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(formatAuthError(error));
    }
  };

  // Social signup handlers
  const handleGoogleSignup = () => handleSocialSignup(googleProvider);
  const handleFacebookSignup = () => handleSocialSignup(facebookProvider);
  const handleTwitterSignup = () => handleSocialSignup(twitterProvider);

  return (
    <AuthLayout>
      <h3 className="auth-heading">Create Your Account</h3>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="fullname" className="auth-label">Full Name</label>
        <input
          type="text"
          id="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Fullname"
          required
          className="auth-input"
        />

        <label htmlFor="course" className="auth-label">Current Course</label>
        <SearchableDropdown
          id="course"
          options={coursesList}
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Select your course"
          required={true}
          className="auth-input"
        />

        <label htmlFor="gender" className="auth-label">Gender</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="auth-input"
        >
          <option value="" disabled>Select your gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="email" className="auth-label">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="auth-input"
        />

        <label htmlFor="password" className="auth-label">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="auth-input"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="auth-button">
          Sign Up
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </p>
        <p className="auth-footer-text mt-4">Or sign up with</p>
        <div className="social-icons">
          <button
            type="button"
            className="social-icon"
            onClick={handleFacebookSignup}
            aria-label="Sign up with Facebook"
          >
            <img src="https://img.icons8.com/color/48/facebook.png" alt="Facebook" className="social-icon-img" />
          </button>
          <button
            type="button"
            className="social-icon"
            onClick={handleTwitterSignup}
            aria-label="Sign up with X (Twitter)"
          >
            <img src="https://img.icons8.com/ios-filled/48/x.png" alt="X" className="social-icon-img" />
          </button>
          <button
            type="button"
            className="social-icon"
            onClick={handleGoogleSignup}
            aria-label="Sign up with Google"
          >
            <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="social-icon-img" />
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
