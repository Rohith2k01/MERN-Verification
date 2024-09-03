// Importing necessary types from Next.js
import type { NextApiRequest, NextApiResponse } from 'next';
// Importing axios for making HTTP requests
import axios from 'axios';
// Importing a utility function for connecting to the MongoDB database
import { connectToDatabase } from '../../utils/mongodb';

// Default export of an asynchronous function to handle API requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only handle POST requests; reject other methods with a 405 status code
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Destructure Aadhaar number from the request body
  const { aadhaarNumber } = req.body;

  // Check if Aadhaar number is provided
  if (!aadhaarNumber) {
    return res.status(400).json({ success: false, message: 'Aadhaar number is required' });
  }

  try {
    // Setup options for the API request to validate Aadhaar number
    const options = {
      method: 'POST',  // HTTP method
      url: 'https://api.apyhub.com/validate/aadhaar',  // URL of the Aadhaar validation API
      headers: {
        'apy-token': process.env.APY_TOKEN as string,  // API token from environment variable
        'Content-Type': 'application/json'  // Content type of the request
      },
      data: {
        aadhaar: aadhaarNumber  // Payload containing the Aadhaar number to be validated
      }
    };

    // Send the request to the Aadhaar validation API
    const response = await axios.request(options);
    // Store the result of the Aadhaar validation
    const verificationResult = response.data;

    // Connect to the MongoDB database
    const { db } = await connectToDatabase();
    // Insert the Aadhaar verification result into the 'aadhaar_verifications' collection
    await db.collection('aadhaar_verifications').insertOne({
      aadhaarNumber,          // Store the Aadhaar number
      result: verificationResult,  // Store the result of the verification
      verifiedAt: new Date()  // Store the current date and time of verification
    });

    // Respond with the verification result and success status
    res.status(200).json({ success: true, data: verificationResult });
  } catch (error: any) {
    // Log and handle errors, including cases where the API request or database operation fails
    console.error('Aadhaar verification error:', error.message || error);
    // Respond with a 500 status code and error message indicating failure
    res.status(500).json({ success: false, message: 'Failed to verify Aadhaar number' });
  }
}

