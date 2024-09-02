import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { panNumber } = req.body;

  if (!panNumber) {
    return res.status(400).json({ success: false, message: 'PAN number is required' });
  }

  const options = {
    method: 'POST',
    url: 'https://pan-information-verification-api.p.rapidapi.com/validation/api/v1/panverification',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'your_default_key_here',
      'x-rapidapi-host': 'pan-information-verification-api.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      pan: panNumber,
      consent: 'yes',
      consent_text: 'I hear by declare my consent agreement for fetching my information via AITAN Labs API'
    }
  };

  try {
    // Send the request to the RapidAPI PAN card verification service
    const response = await axios.request(options);
    const verificationResult = response.data;

    // Store the verification result in MongoDB
    const { db } = await connectToDatabase();
    await db.collection('pan_verifications').insertOne({
      panNumber,
      result: verificationResult,
      verifiedAt: new Date()
    });

    res.status(200).json({ success: true, data: verificationResult });
  } catch (error: any) {
    console.error('PAN verification error:', error);

    if (error.response) {
      // Handle API response errors
      res.status(error.response.status).json({
        success: false,
        message: 'Failed to verify PAN card',
        panNumber,
        error: error.response.data,
      });
    } else if (error.request) {
      // Handle no response received
      res.status(500).json({
        success: false,
        message: 'No response received from the verification service',
        error: error.message,
      });
    } else {
      // Handle other errors
      res.status(500).json({
        success: false,
        message: 'Failed to verify PAN card',
        error: error.message,
      });
    }
  }
}