"use client";
import React, { useState } from 'react';
import styles from './styles.module.css'

const PANVerification: React.FC = () => {
  const [panNumber, setPanNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyPAN = async () => {
    // Basic validation
    if (!panNumber) {
      setError('Please enter a PAN number.');
      return;
    }

    setIsLoading(true);
    setError(null); // Clear any existing error
    try {
      const response = await fetch('/api/auth/verifyPAN', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panNumber }),
      });
      const data = await response.json();
      if (data.success) {
        setVerificationResult(data.data);
      } else {
        setError('Failed to verify PAN card: ' + data.message);
      }
    } catch (error) {
      setError('An error occurred during verification');
    } finally {
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
        onChange={(e) => setPanNumber(e.target.value)}
        placeholder="Enter PAN number"
        aria-label="PAN number"
        disabled={isLoading}
      />
      <button onClick={handleVerifyPAN} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify PAN'}
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

export default PANVerification;