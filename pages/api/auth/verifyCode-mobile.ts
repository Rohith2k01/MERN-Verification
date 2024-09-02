import type { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { connectToDatabase } from '../../utils/mobile'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

const client = twilio(accountSid, authToken)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { phoneNumber, code } = req.body

    try {
      const verification_check = await client.verify.v2
        .services(verifyServiceSid!)
        .verificationChecks.create({ to: phoneNumber, code })

      if (verification_check.status === 'approved') {
        // Connect to MongoDB and store the verified phone number
        const { db } = await connectToDatabase()
        await db.collection('verified_users').insertOne({ phoneNumber, verifiedAt: new Date() })

        res.status(200).json({ success: true, message: 'Phone number verified' })
      } else {
        res.status(400).json({ success: false, error: 'Invalid verification code' })
      }
    } catch (error) {
      res.status(400).json({ success: false, error: 'Failed to verify code' })
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}