// components/EmailVerification.tsx
"use client";
import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css'

const EmailVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOTP = async () => {
    try {
      const response = await axios.post('/api/auth/send-otp-email', { email });
      setMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('/api/auth/verify-email', { email, otp });
      setMessage(response.data.message);
      if (response.data.message === 'OTP verified successfully') {
        // Handle successful verification (e.g., redirect to dashboard)
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to verify OTP');
    }
  };

  return (
    <main>
    <div className={styles.h1}>
      <p>Email</p>
      <input 
        className={styles.in}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleSendOTP} disabled={isOtpSent}>
        Send OTP
      </button>
      
      {isOtpSent && (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </>
      )}
      
      {message && <p>{message}</p>}
    </div>
    </main>
  );
};

export default EmailVerification;