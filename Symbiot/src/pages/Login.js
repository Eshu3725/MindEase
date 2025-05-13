import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  auth,
  signInWithEmailAndPassword,
  googleProvider,
  facebookProvider,
  twitterProvider,
  signInWithPopup,
  getIdToken
} from '../firebase';
import AuthLayout from '../components/AuthLayout';
import { formatAuthError } from '../utils/authHelpers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Optional: store user info in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('userEmail');
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Email/password login error:", error);
      setError(formatAuthError(error));
    }
  };

  // Handle social media login
  const handleSocialLogin = async (provider) => {
    try {
      setError('');

      // Check if the provider is properly configured
      if (provider === facebookProvider || provider === twitterProvider) {
        // For Facebook and Twitter, check if they're properly configured in Firebase
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;

          // Get the ID token for backend authentication
          const idToken = await getIdToken(user);

          // Store token in localStorage for API requests
          localStorage.setItem("authToken", idToken);

          // Navigate to dashboard
          navigate('/dashboard');
        } catch (socialError) {
          console.error("Social login error:", socialError);

          // Use the helper function to format the error message
          setError(formatAuthError(socialError));
        }
      } else {
        // For Google or other providers
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Get the ID token for backend authentication
        const idToken = await getIdToken(user);

        // Store token in localStorage for API requests
        localStorage.setItem("authToken", idToken);

        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(formatAuthError(error));
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => handleSocialLogin(googleProvider);
  const handleFacebookLogin = () => handleSocialLogin(facebookProvider);
  const handleTwitterLogin = () => handleSocialLogin(twitterProvider);

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email" className="auth-label">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Enter a valid email address"
          className="auth-input"
        />

        <div className="flex justify-between items-center">
          <label htmlFor="password" className="auth-label">Password</label>
          <Link to="/reset-password" className="text-xs text-primary-dark">
            Forgot Password?
          </Link>
        </div>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="auth-input"
        />

        <div className="flex items-center mt-2.5 mb-2.5">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-1.5"
          />
          <label htmlFor="remember" className="text-sm text-gray-700">
            Remember Me
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="auth-button">
          Sign In
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          New on our Platform? <Link to="/signup" className="auth-link">Create an Account</Link>
        </p>
        <div className="social-icons">
          <button
            type="button"
            className="social-icon"
            onClick={handleFacebookLogin}
            aria-label="Sign in with Facebook"
          >
            <img src="https://img.icons8.com/color/48/facebook.png" alt="Facebook" className="social-icon-img" />
          </button>
          <button
            type="button"
            className="social-icon"
            onClick={handleTwitterLogin}
            aria-label="Sign in with X (Twitter)"
          >
            <img src="https://img.icons8.com/ios-filled/48/x.png" alt="X" className="social-icon-img" />
          </button>
          <button
            type="button"
            className="social-icon"
            onClick={handleGoogleLogin}
            aria-label="Sign in with Google"
          >
            <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="social-icon-img" />
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
