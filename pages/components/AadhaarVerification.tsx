import React, { useState } from 'react';
import styles from './styles.module.css'; // Import CSS module for styling

const AadhaarVerification: React.FC = () => {
  // State to store the Aadhaar number input by the user
  const [aadhaarNumber, setAadhaarNumber] = useState('');

  // State to store the result of Aadhaar verification
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // State to track the loading status during verification
  const [isLoading, setIsLoading] = useState(false);

  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to handle Aadhaar verification
  const handleVerifyAadhaar = async () => {
    setIsLoading(true); // Set loading state to true when verification starts
    setError(null); // Clear any previous errors
    try {
      // Send a POST request to the server to verify the Aadhaar number
      const response = await fetch('/api/auth/verifyAadhaar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber }),
      });

      // Parse the response from the server
      const data = await response.json();
      
      if (data.success) {
        // If verification is successful, store the result
        setVerificationResult(data.data);
      } else {
        // If verification fails, set an error message
        setError(data.message || 'Failed to verify Aadhaar number');
      }
    } catch (error) {
      // Catch any errors that occur during the fetch operation
      setError('An error occurred during verification');
    } finally {
      // Reset the loading state regardless of the outcome
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className={styles.h1}>
        <p>Aadhaar Number</p>
        <input
          className={styles.in}
          type="text"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value)}
          placeholder="Enter Aadhaar Number"
        />
        <button onClick={handleVerifyAadhaar} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Aadhaar'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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

export default AadhaarVerification;

