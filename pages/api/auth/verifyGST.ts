// Importing types from Next.js for request and response handling
import type { NextApiRequest, NextApiResponse } from 'next';
// Importing a utility function to connect to the MongoDB database
import { connectToDatabase } from '../../utils/mongodb';
// Importing the https module to make HTTP requests
import https from 'https';

// Default export of an asynchronous function to handle API requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is not POST; if not, return a 405 Method Not Allowed response
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Extract the GST number from the request body
  const { gstNumber } = req.body;

  // Check if the GST number is provided; if not, return a 400 Bad Request response
  if (!gstNumber) {
    return res.status(400).json({ success: false, message: 'GST number is required' });
  }

  // Define the options for the HTTPS request to the GST verification API
  const options = {
    method: 'GET',
    hostname: 'gst-insights-api.p.rapidapi.com',
    port: null, // Default port for HTTPS
    path: `/getGSTDetailsUsingGST/${gstNumber}`, // API endpoint for fetching GST details
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'your_default_key_here', // Use an environment variable for the API key
      'x-rapidapi-host': 'gst-insights-api.p.rapidapi.com'
    }
  };

  try {
    // Make the HTTPS request to the API using a promise to handle the asynchronous response
    const verificationResult = await new Promise<any>((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks: Buffer[] = []; // Array to store chunks of data

        // Event listener for incoming data chunks
        res.on('data', (chunk) => {
          chunks.push(chunk); // Add each chunk to the array
        });

        // Event listener for the end of the response
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString(); // Concatenate all chunks into a single buffer and convert to string
          resolve(JSON.parse(body)); // Parse the response body as JSON and resolve the promise
        });
      });

      // Event listener for request errors
      req.on('error', (error) => {
        reject(error); // Reject the promise if an error occurs
      });

      req.end(); // End the request
    });

    // Connect to the MongoDB database and store the verification result
    const { db } = await connectToDatabase();
    await db.collection('gst_verifications').insertOne({
      gstNumber,
      result: verificationResult,
      verifiedAt: new Date()
    });

    // Respond with the verification result
    res.status(200).json({ success: true, data: verificationResult });
  } catch (error: any) {
    console.error('GST verification error:', error);

    // Error handling for different types of errors
    if (error.response) {
      // If there is an API response error, use its status and message
      res.status(error.response.status).json({
        success: false,
        message: 'Failed to verify GST number',
        error: error.message,
      });
    } else if (error.request) {
      // If no response is received from the verification service, return a 500 status code
      res.status(500).json({
        success: false,
        message: 'No response received from the verification service',
        error: error.message,
      });
    } else {
      // If an error occurs but it's not related to the API request or response, return a generic error message
      res.status(500).json({
        success: false,
        message: 'Failed to verify GST number',
        error: error.message,
      });
    }
  }
}
