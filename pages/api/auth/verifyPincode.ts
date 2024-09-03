// Importing types from Next.js for defining request and response objects
import type { NextApiRequest, NextApiResponse } from 'next';

// Importing a utility function to connect to the MongoDB database
import { connectToDatabase } from '../../utils/mongodb';

// Importing the https module to make HTTPS requests
import https from 'https';

// Default export of an asynchronous function to handle API requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST; if not, return a 405 Method Not Allowed response
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Extract the pincode from the request body
  const { pincode } = req.body;

  // Check if the pincode is provided; if not, return a 400 Bad Request response
  if (!pincode) {
    return res.status(400).json({ success: false, error: 'Pincode is required' });
  }

  // Define the options for the https request to the pincode verification API
  const options = {
    method: 'GET', // Request method
    hostname: 'india-pincode-with-latitude-and-longitude.p.rapidapi.com', // API hostname
    port: null, // Default port for HTTPS
    path: `/api/v1/pincode/${pincode}`, // API path, including the pincode
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY as string, // Use an environment variable for the API key
      'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com' // Hostname for the API
    }
  };

  try {
    // Create a promise that wraps the https request to handle asynchronous operations
    const verificationResult = await new Promise((resolve, reject) => {
      // Initiating the HTTPS request
      const req = https.request(options, (res) => {
        const chunks: Buffer[] = []; // Array to hold chunks of data

        // On receiving data, push the chunk to the chunks array
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        // On ending the response, concatenate all chunks and parse the JSON body
        res.on('end', () => {
          try {
            const body = Buffer.concat(chunks); // Combine all chunks into a single Buffer
            resolve(JSON.parse(body.toString())); // Parse the Buffer into a JSON object
          } catch (error) {
            reject(new Error('Error parsing response body')); // Handle JSON parsing errors
          }
        });
      });

      // Handle request errors
      req.on('error', (error) => {
        reject(error); // Reject the promise on request error
      });

      // End the request to send it
      req.end();
    });

    // Store the verification result in MongoDB
    const { db } = await connectToDatabase(); // Connect to the database
    await db.collection('pincode_verifications').insertOne({
      pincode,
      result: verificationResult,
      verifiedAt: new Date() // Record the date and time of verification
    });

    // Respond with the verification result
    return res.status(200).json({ success: true, data: verificationResult });
  } catch (error: any) {
    // Log the error to the console
    console.error('Pincode verification error:', error.message || error);

    // Error handling for JSON parsing errors
    if (error.message.includes('Error parsing response body')) {
      return res.status(500).json({
        success: false,
        error: 'Error parsing response from verification service'
      });
    }

    // Generic error response for any other errors
    return res.status(500).json({
      success: false,
      error: 'Failed to verify pincode'
    });
  }
}

