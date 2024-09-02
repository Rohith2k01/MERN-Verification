import type { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

const client = twilio(accountSid, authToken)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { phoneNumber } = req.body

    try {
      const verification = await client.verify.v2
        .services(verifyServiceSid!)
        .verifications.create({ to: phoneNumber, channel: 'sms' })

      res.status(200).json({ success: true, status: verification.status })
    } catch (error) {
      res.status(400).json({ success: false, error: 'Failed to send verification',phoneNumber,accountSid,authToken, verifyServiceSid})
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}