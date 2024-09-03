import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import styles from './styles.module.css'; // Import CSS module for styling

const EmailVerification: React.FC = () => {
  // State to store the user's email input
  const [email, setEmail] = useState('');

  // State to store the OTP entered by the user
  const [otp, setOtp] = useState('');

  // State to store messages, such as success or error messages
  const [message, setMessage] = useState('');

  // State to track if the OTP has been sent
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Function to send OTP to the provided email address
  const handleSendOTP = async () => {
    try {
      // Make a POST request to send OTP to the server
      const response = await axios.post('/api/auth/send-otp-email', { email });
      setMessage(response.data.message); // Set the message from the server response
      setIsOtpSent(true); // Update state to indicate OTP has been sent
    } catch (error) {
      // Handle any errors that occur during the request
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  // Function to verify the OTP entered by the user
  const handleVerifyOTP = async () => {
    try {
      // Make a POST request to verify the OTP with the server
      const response = await axios.post('/api/auth/verify-email', { email, otp });
      setMessage(response.data.message); // Set the message from the server response
      if (response.data.message === 'OTP verified successfully') {
        // Handle successful OTP verification (e.g., redirect to another page)
      }
    } catch (error) {
      // Handle any errors that occur during the request
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
          onChange={(e) => setEmail(e.target.value)} // Update email state on input change
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
              onChange={(e) => setOtp(e.target.value)} // Update OTP state on input change
              placeholder="Enter OTP"
            />
            <button onClick={handleVerifyOTP}>Verify OTP</button>
          </>
        )}
        
        {message && <p>{message}</p>} {/* Display message if present */}
      </div>
    </main>
  );
};

export default EmailVerification;
