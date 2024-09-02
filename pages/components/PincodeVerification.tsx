"use client";
import React, { useState } from 'react'
import styles from './styles.module.css'

const PincodeVerification: React.FC = () => {
  const [pincode, setPincode] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyPincode = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verifyPincode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      })
      const data = await response.json()
      if (data.success) {
        setVerificationResult(data.data)
      } else {
        alert('Failed to verify pincode: ' + data.error)
      }
    } catch (error) {
      alert('An error occurred during verification')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
    <div className={styles.h1}>
        <p>Address Lookup</p>
      <input
             className={styles.in}
        type="text"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="Enter pincode"
      />
      <button onClick={handleVerifyPincode} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify Pincode'}
      </button>
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

export default PincodeVerification