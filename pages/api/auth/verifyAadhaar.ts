import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { connectToDatabase } from '../../utils/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' })
  }

  const { aadhaarNumber } = req.body

  // Check if Aadhaar number is provided
  if (!aadhaarNumber) {
    return res.status(400).json({ success: false, message: 'Aadhaar number is required' })
  }

  try {
    // Setup options for the API request
    const options = {
      method: 'POST',
      url: 'https://api.apyhub.com/validate/aadhaar',
      headers: {
        'apy-token': process.env.APY_TOKEN as string, // Replace with your environment variable name
        'Content-Type': 'application/json'
      },
      data: {
        aadhaar: aadhaarNumber
      }
    }

    // Send the request to the Aadhar validation API
    const response = await axios.request(options)
    const verificationResult = response.data

    // Store the verification result in MongoDB
    const { db } = await connectToDatabase()
    await db.collection('aadhaar_verifications').insertOne({
      aadhaarNumber,
      result: verificationResult,
      verifiedAt: new Date()
    })

    // Respond with the verification result
    res.status(200).json({ success: true, data: verificationResult })
  } catch (error: any) {
    // Log and handle errors
    console.error('Aadhaar verification error:', error.message || error)
    res.status(500).json({ success: false, message: 'Failed to verify Aadhaar number' })
  }
}