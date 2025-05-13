import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, sendPasswordResetEmail } from '../firebase';
import AuthLayout from '../components/AuthLayout';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <h3 className="auth-heading">Forgot Your Password?</h3>
      <p className="mb-5 text-gray-600">
        Enter your registered email to receive a reset link.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email" className="auth-label">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="auth-input"
        />

        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="auth-button">
          Send Reset Link
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Remembered? <Link to="/login" className="auth-link">Back to Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
