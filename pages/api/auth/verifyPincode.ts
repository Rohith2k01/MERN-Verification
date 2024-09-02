import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../utils/mongodb'
import https from 'https'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { pincode } = req.body

  if (!pincode) {
    return res.status(400).json({ success: false, error: 'Pincode is required' })
  }

  const options = {
    method: 'GET',
    hostname: 'india-pincode-with-latitude-and-longitude.p.rapidapi.com',
    port: null,
    path: `/api/v1/pincode/${pincode}`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
      'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
    }
  }

  try {
    // Create a promise that wraps the https request
    const verificationResult = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks: Buffer[] = []

        res.on('data', (chunk) => {
          chunks.push(chunk)
        })

        res.on('end', () => {
          try {
            const body = Buffer.concat(chunks)
            resolve(JSON.parse(body.toString()))
          } catch (error) {
            reject(new Error('Error parsing response body'))
          }
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      req.end()
    })

    // Store the verification result in MongoDB
    const { db } = await connectToDatabase()
    await db.collection('pincode_verifications').insertOne({
      pincode,
      result: verificationResult,
      verifiedAt: new Date()
    })

    return res.status(200).json({ success: true, data: verificationResult })
  } catch (error: any) {
    console.error('Pincode verification error:', error.message || error)

    if (error.message.includes('Error parsing response body')) {
      return res.status(500).json({
        success: false,
        error: 'Error parsing response from verification service'
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to verify pincode'
    })
  }
}