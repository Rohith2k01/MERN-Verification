import type { NextApiRequest, NextApiResponse } from 'next'; // Importing types for API request and response from Next.js
import twilio from 'twilio'; // Importing the Twilio library for sending SMS

// Reading environment variables for Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Twilio Verify Service SID

// Creating a Twilio client instance using account SID and auth token
const client = twilio(accountSid, authToken);

// Default export for the API handler function
export default async function handler(
  req: NextApiRequest,  // Typing the request object
  res: NextApiResponse  // Typing the response object
) {
  // Check if the HTTP request method is 'POST'
  if (req.method === 'POST') {
    const { phoneNumber } = req.body; // Extract the phone number from the request body

    try {
      // Send a verification SMS using Twilio's Verify service
      const verification = await client.verify.v2
        .services(verifyServiceSid!) // Specify the Verify service SID (using non-null assertion)
        .verifications.create({ to: phoneNumber, channel: 'sms' }); // Send SMS to the provided phone number

      // Respond with a 200 status code and success message if the verification SMS is sent successfully
      res.status(200).json({ success: true, status: verification.status });
    } catch (error) {
      // If there's an error, respond with a 400 status code and an error message
      res.status(400).json({ 
        success: false, 
        error: 'Failed to send verification',
        phoneNumber,  // Include the phone number in the response for debugging
        accountSid,   // Include the account SID in the response for debugging
        authToken,    // Include the auth token in the response for debugging
        verifyServiceSid // Include the verify service SID in the response for debugging
      });
    }
  } else {
    // If the request method is not 'POST', respond with a 405 status code and an error message
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
