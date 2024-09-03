// Importing types from Next.js for request and response handling
import type { NextApiRequest, NextApiResponse } from 'next';

// Importing axios for making HTTP requests
import axios from 'axios';

// Importing a utility function to connect to the MongoDB database
import { connectToDatabase } from '../../utils/mongodb';

// Default export of an asynchronous function to handle API requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is not POST; if not, return a 405 Method Not Allowed response
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Extract the PAN number from the request body
  const { panNumber } = req.body;

  // Check if the PAN number is provided; if not, return a 400 Bad Request response
  if (!panNumber) {
    return res.status(400).json({ success: false, message: 'PAN number is required' });
  }

  // Define the options for the axios request to the PAN verification API
  const options = {
    method: 'POST', // Request method
    url: 'https://pan-information-verification-api.p.rapidapi.com/validation/api/v1/panverification', // API endpoint for PAN verification
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'your_default_key_here', // Use an environment variable for the API key
      'x-rapidapi-host': 'pan-information-verification-api.p.rapidapi.com', // Hostname for the API
      'Content-Type': 'application/json' // Content type header
    },
    data: {
      pan: panNumber, // PAN number to verify
      consent: 'yes', // User consent for data verification
      consent_text: 'I hear by declare my consent agreement for fetching my information via AITAN Labs API' // Consent declaration text
    }
  };

  try {
    // Send the request to the RapidAPI PAN card verification service
    const response = await axios.request(options); // Making the API request using axios
    const verificationResult = response.data; // Extracting the response data

    // Store the verification result in MongoDB
    const { db } = await connectToDatabase(); // Connect to the database
    await db.collection('pan_verifications').insertOne({
      panNumber,
      result: verificationResult,
      verifiedAt: new Date() // Record the date and time of verification
    });

    // Respond with the verification result
    res.status(200).json({ success: true, data: verificationResult });
  } catch (error: any) {
    // Log the error to the console
    console.error('PAN verification error:', error);

    // Error handling for different types of errors
    if (error.response) {
      // Handle API response errors (i.e., the server responded with a status code outside of the 2xx range)
      res.status(error.response.status).json({
        success: false,
        message: 'Failed to verify PAN card',
        panNumber,
        error: error.response.data, // Include the API response error data
      });
    } else if (error.request) {
      // Handle no response received (i.e., the request was made but no response was received)
      res.status(500).json({
        success: false,
        message: 'No response received from the verification service',
        error: error.message, // Include the error message
      });
    } else {
      // Handle other errors (i.e., errors in setting up the request)
      res.status(500).json({
        success: false,
        message: 'Failed to verify PAN card',
        error: error.message, // Include the error message
      });
    }
  }
}
