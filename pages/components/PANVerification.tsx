import React, { useState } from 'react';
import styles from './styles.module.css'; // Import CSS module for styling

const PANVerification: React.FC = () => {
  // State to store the PAN number input by the user
  const [panNumber, setPanNumber] = useState('');

  // State to store the result of PAN verification
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // State to track the loading status during verification
  const [isLoading, setIsLoading] = useState(false);

  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to handle PAN card verification
  const handleVerifyPAN = async () => {
    // Basic validation to ensure PAN number is not empty
    if (!panNumber) {
      setError('Please enter a PAN number.'); // Set error message if no PAN number is provided
      return;
    }

    setIsLoading(true); // Set loading state to true when verification starts
    setError(null); // Clear any previous errors
    try {
      // Send a POST request to the server to verify the PAN number
      const response = await fetch('/api/auth/verifyPAN', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panNumber }),
      });

      // Parse the response from the server
      const data = await response.json();
      
      if (data.success) {
        // If verification is successful, store the result
        setVerificationResult(data.data);
      } else {
        // If verification fails, set an error message
        setError('Failed to verify PAN card: ' + data.message);
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
        <p>PAN Card</p>
        <input
          className={styles.in}
          type="text"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value)} // Update panNumber state on input change
          placeholder="Enter PAN number"
          aria-label="PAN number" // Accessibility label for screen readers
          disabled={isLoading} // Disable input while loading
        />
        <button onClick={handleVerifyPAN} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify PAN'}
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

export default PANVerification;
