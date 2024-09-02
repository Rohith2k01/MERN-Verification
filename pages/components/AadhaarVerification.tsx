"use client";
import React, { useState } from 'react'
import styles from './styles.module.css'

const AadhaarVerification: React.FC = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerifyAadhaar = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/auth/verifyAadhaar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber }),
      })
      const data = await response.json()
      if (data.success) {
        setVerificationResult(data.data)
      } else {
        setError(data.message || 'Failed to verify Aadhaar number')
      }
    } catch (error) {
      setError('An error occurred during verification')
    } finally {
      setIsLoading(false)
    }
  }

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
  )
}


export default AadhaarVerification