import React, { useState } from 'react';
import styles from './styles.module.css'; // Import CSS module for styling

const GSTVerification: React.FC = () => {
  // State to store the GST number input by the user
  const [gstNumber, setGstNumber] = useState('');

  // State to store the result of GST verification
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // State to track the loading status during verification
  const [isLoading, setIsLoading] = useState(false);

  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to handle GST verification
  const handleVerifyGST = async () => {
    setIsLoading(true); // Set loading state to true when verification starts
    setError(null); // Clear any previous errors
    try {
      // Send a POST request to the server to verify the GST number
      const response = await fetch('/api/auth/verifyGST', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstNumber }),
      });

      // Parse the response from the server
      const data = await response.json();
      
      if (data.success) {
        // If verification is successful, store the result
        setVerificationResult(data.data);
      } else {
        // If verification fails, set an error message
        setError(data.message || 'Failed to verify GST number');
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
        <p>GST Number</p>
        <input
          className={styles.in}
          type="text"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)} // Update gstNumber state on input change
          placeholder="Enter GST number"
        />
        <button onClick={handleVerifyGST} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify GST'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if present */}
        {verificationResult && (
          <div>
            <h3>Verification Result:</h3>
            <pre>{JSON.stringify(verificationResult, null, 2)}</pre> {/* Display verification result */}
          </div>
        )}
      </div>
    </main>
  );
};

export default GSTVerification;
