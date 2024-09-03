import { useEffect, useState } from 'react';
import styles from './styles.module.css'; // Import CSS module for styling

const PhoneVerification: React.FC = () => {
  // State to store the phone number entered by the user
  const [phoneNumber, setPhoneNumber] = useState('');

  // State to store the verification code entered by the user
  const [verificationCode, setVerificationCode] = useState('');

  // State to track the current step of the verification process
  const [step, setStep] = useState<'input' | 'verify'>('input');

  // Function to handle sending the verification code to the phone number
  const handleSendVerification = async () => {
    try {
      // Send a POST request to the server to request a verification code
      const response = await fetch('/api/auth/send-otp-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      // Parse the server response
      const data = await response.json();

      if (data.success) {
        // If the response indicates success, move to the verification step
        setStep('verify');
      } else {
        // If the response indicates failure, alert the user
        alert('Failed to send verification code');
      }
    } catch (error) {
      // Catch and alert any errors that occur during the request
      alert('An error occurred while sending verification code');
    }
  };

  // Function to handle verifying the code entered by the user
  const handleVerifyCode = async () => {
    try {
      // Send a POST request to the server to verify the entered code
      const response = await fetch('/api/auth/verifyCode-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });

      // Parse the server response
      const data = await response.json();

      if (data.success) {
        // If the response indicates success, alert the user
        alert('Phone number verified successfully!');
      } else {
        // If the response indicates failure, alert the user
        alert('Failed to verify code');
      }
    } catch (error) {
      // Catch and alert any errors that occur during the request
      alert('An error occurred while verifying the code');
    }
  };

  return (
    <main>
      <div className={styles.h1}>
        <p>Mobile Number</p>
        {step === 'input' ? (
          <>
            {/* Input field for the phone number */}
            <input
              className={styles.in}
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
            {/* Button to send the verification code */}
            <button onClick={handleSendVerification}>Send Verification Code</button>
          </>
        ) : (
          <>
            {/* Input field for the verification code */}
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
            />
            {/* Button to verify the entered code */}
            <button onClick={handleVerifyCode}>Verify Code</button>
          </>
        )}
      </div>
    </main>
  );
};

export default PhoneVerification;
