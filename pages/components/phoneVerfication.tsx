// pages/index.tsx
"use client";
import { useEffect, useState } from 'react';
import styles from './styles.module.css'




const PhoneVerification: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'input' | 'verify'>('input')

  const handleSendVerification = async () => {
    const response = await fetch('/api/auth/send-otp-mobile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    })
    const data = await response.json()
    if (data.success) {
      setStep('verify')
    } else {
      alert('Failed to send verification code')
    }
  }

  const handleVerifyCode = async () => {
    const response = await fetch('/api/auth/verifyCode-mobile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, code: verificationCode }),
    })
    const data = await response.json()
    console.log(data)
    if (data.success) {
      alert('Phone number verified successfully!')
    } else {
      alert('Failed to verify code')
    }
  }

  return (
    <main>
    <div className={styles.h1}>
        <p>Mobile Number</p>
      {step === 'input' ? (
        <>
          <input
           className={styles.in}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
          <button onClick={handleSendVerification}>Send Verification Code</button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </>
      )}
    </div>
    </main>
  )
}

export default PhoneVerification