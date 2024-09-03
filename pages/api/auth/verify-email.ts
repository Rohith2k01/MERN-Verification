import { NextApiRequest, NextApiResponse } from 'next'; // Importing types for API request and response from Next.js
import { verifyOTP } from '../../utils/otpUtils'; // Importing a utility function to verify the OTP

// Default export for the API handler function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Check if the HTTP request method is 'POST'
  if (req.method === 'POST') {
    // Destructure email and OTP from the request body
    const { email, otp } = req.body;

    // Check if both email and OTP are provided in the request body
    if (!email || !otp) {
      // Respond with a 400 status code if either is missing
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
      // Verify the OTP using the verifyOTP utility function
      const isValid = await verifyOTP(email, otp);
      
      // If OTP is valid, respond with a 200 status code and a success message
      if (isValid) {
        res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        // If OTP is invalid or expired, respond with a 400 status code and an error message
        res.status(400).json({ message: 'Invalid or expired OTP' });
      }
    } catch (error) {
      // If there's an error during the OTP verification process, log it and respond with a 500 status code
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Failed to verify OTP' });
    }
  } else {
    // If the request method is not 'POST', set the 'Allow' header to 'POST' and respond with a 405 status code
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
