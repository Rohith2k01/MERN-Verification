import { NextApiRequest, NextApiResponse } from 'next'; // Importing types for API request and response from Next.js
import { sendOTP } from '../../utils/otpUtils'; // Importing a utility function to send OTP from a utilities module

// Exporting an asynchronous function to handle API requests
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Check if the request method is 'POST'
  if (req.method === 'POST') {
    const { email } = req.body; // Destructure the email from the request body
    
    // Check if the email is provided in the request
    if (!email) {
      // Respond with a 400 status code (Bad Request) if email is missing
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      // Attempt to send an OTP to the provided email
      await sendOTP(email);
      
      // Respond with a 200 status code (OK) if OTP is sent successfully
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Error sending OTP:', error);
      
      // Respond with a 500 status code (Internal Server Error) if sending OTP fails
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } else {
    // Set the 'Allow' header to 'POST' if the request method is not allowed
    res.setHeader('Allow', ['POST']);
    
    // Respond with a 405 status code (Method Not Allowed) if request method is not 'POST'
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
