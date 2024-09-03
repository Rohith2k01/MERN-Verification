import React, { useState } from 'react';
import styles from './styles.module.css'; // Import CSS module for styling

const PincodeVerification: React.FC = () => {
  // State to store the pincode entered by the user
  const [pincode, setPincode] = useState('');

  // State to store the result of the verification process
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // State to track the loading state during verification
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the pincode verification process
  const handleVerifyPincode = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      // Send a POST request to the server to verify the pincode
      const response = await fetch('/api/auth/verifyPincode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      });

      // Parse the server response
      const data = await response.json();

      if (data.success) {
        // If verification is successful, store the result
        setVerificationResult(data.data);
      } else {
        // If verification fails, alert the user with the error message
        alert('Failed to verify pincode: ' + data.error);
      }
    } catch (error) {
      // Catch and alert any errors that occur during the request
      alert('An error occurred during verification');
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <main>
      <div className={styles.h1}>
        <p>Address Lookup</p>
        {/* Input field for the pincode */}
        <input
          className={styles.in}
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
        />
        {/* Button to trigger pincode verification */}
        <button onClick={handleVerifyPincode} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Pincode'}
        </button>
        {/* Display verification result if available */}
        {verificationResult && (
          <div>
            <h3>Verification Result:</h3>
            <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
};

export default PincodeVerification;
