// Importing necessary types from Next.js for type definitions
import type { NextApiRequest, NextApiResponse } from 'next';
// Importing the Twilio library for handling SMS-based verifications
import twilio from 'twilio';
// Importing a utility function for connecting to the MongoDB database
import { connectToDatabase } from '../../utils/mobile';

// Environment variables for Twilio credentials and service ID
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Creating a Twilio client instance using the account SID and auth token
const client = twilio(accountSid, authToken);

// Default export of an asynchronous function to handle API requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST; only POST requests are allowed
  if (req.method === 'POST') {
    // Extract phone number and verification code from the request body
    const { phoneNumber, code } = req.body;

    try {
      // Use Twilio's verify service to check the verification code for the given phone number
      const verification_check = await client.verify.v2
        .services(verifyServiceSid!)
        .verificationChecks.create({ to: phoneNumber, code });

      // Check if the verification status is 'approved'
      if (verification_check.status === 'approved') {
        // Connect to MongoDB and store the verified phone number with the current date
        const { db } = await connectToDatabase();
        await db.collection('verified_users').insertOne({ phoneNumber, verifiedAt: new Date() });

        // Respond with a success message if the phone number is verified
        res.status(200).json({ success: true, message: 'Phone number verified' });
      } else {
        // Respond with an error message if the verification code is invalid
        res.status(400).json({ success: false, error: 'Invalid verification code' });
      }
    } catch (error) {
      // Log error and respond with a 400 status code if an exception occurs during verification or database operation
      res.status(400).json({ success: false, error: 'Failed to verify code' });
    }
  } else {
    // Respond with a 405 status code if the request method is not allowed
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
