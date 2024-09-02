import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../utils/mongodb'
import https from 'https'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' })
  }

  const { gstNumber } = req.body

  if (!gstNumber) {
    return res.status(400).json({ success: false, message: 'GST number is required' })
  }

  const options = {
    method: 'GET',
    hostname: 'gst-insights-api.p.rapidapi.com',
    port: null,
    path: `/getGSTDetailsUsingGST/${gstNumber}`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'your_default_key_here',
      'x-rapidapi-host': 'gst-insights-api.p.rapidapi.com'
    }
  }

  try {
    const verificationResult = await new Promise<any>((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks: Buffer[] = []

        res.on('data', (chunk) => {
          chunks.push(chunk)
        })

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString()
          resolve(JSON.parse(body))
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      req.end()
    })

    // Store the verification result in MongoDB
    const { db } = await connectToDatabase()
    await db.collection('gst_verifications').insertOne({
      gstNumber,
      result: verificationResult,
      verifiedAt: new Date()
    })

    res.status(200).json({ success: true, data: verificationResult })
  } catch (error: any) {
    console.error('GST verification error:', error)

    if (error.response) {
      // Handle API response errors
      res.status(error.response.status).json({
        success: false,
        message: 'Failed to verify GST number',
        error: error.message,
      })
    } else if (error.request) {
      // Handle no response received
      res.status(500).json({
        success: false,
        message: 'No response received from the verification service',
        error: error.message,
      })
    } else {
      // Handle other errors
      res.status(500).json({
        success: false,
        message: 'Failed to verify GST number',
        error: error.message,
      })
    }
  }
}