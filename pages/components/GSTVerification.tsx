"use client";
import React, { useState } from 'react'
import styles from './styles.module.css'

const GSTVerification: React.FC = () => {
  const [gstNumber, setGstNumber] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerifyGST = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/auth/verifyGST', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstNumber }),
      })
      const data = await response.json()
      if (data.success) {
        setVerificationResult(data.data)
      } else {
        setError(data.message || 'Failed to verify GST number')
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
        <p>GST Number</p>
      <input
        className={styles.in}
        type="text"
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value)}
        placeholder="Enter GST number"
      />
      <button onClick={handleVerifyGST} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify GST'}
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

export default GSTVerification