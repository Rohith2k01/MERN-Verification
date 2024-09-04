import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css'

interface VerificationResult {
  status: string;
  message: string;
  data?: {
    account_exists: boolean;
    name_at_bank?: string;
    status?: string;
  };
}

const BankAccountVerification: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<VerificationResult>('/api/auth/verify-account', { accountNumber, ifsc });
  
      setResult(response.data);
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
      setResult({ status: false, message: 'An error occurred during verification' });
    }
  };

  return (
    <div className={styles.h1}>
      <p>Indian Bank Account Verification</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter Account Number"
          required
          className={styles.in}
        />
        <input
          type="text"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
          placeholder="Enter IFSC Code"
          required
          className={styles.in}
        />
        <button  type="submit" className={styles.b}>Verify Account</button>
      </form>
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Verification Result:</h2>
          <p className={`font-bold ${result.status ? 'text-green-600' : 'text-red-600'}`}>
            {result.status ? 'in_progress' : 'completed'}
          </p>
          <p>{result.message}</p>
          {result.data && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Account Details:</h3>
              <p>Account Exists: {result.data.account_exists ? 'YES' : 'NO'}</p>
              {result.data.name_at_bank && <p>Account Name: {result.data.name_at_bank}</p>}
              {result.data.status && <p>Account Status: {result.data.status}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BankAccountVerification;