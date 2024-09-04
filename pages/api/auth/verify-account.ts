import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { accountNumber, ifsc } = req.body;

    if (!accountNumber || !ifsc) {
      return res.status(400).json({ success: false, message: 'Account number and IFSC code are required' });
    }

    try {
      // Step 1: Send POST request
      const postResponse = await axios.post(
        'https://indian-bank-account-verification.p.rapidapi.com/v3/tasks/async/verify_with_source/validate_bank_account',
        {
          task_id: '123', // Placeholder value
          group_id: '1234', // Placeholder value
          data: {
            bank_account_no: accountNumber,
            bank_ifsc_code: ifsc
          }
        },
        {
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEYS!,
            'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com',
            'Content-Type': 'application/json'
          }
        }
      );

      const requestId = postResponse.data.request_id as string;
      const DELAY_DURATION  = 5000;

      console.log('POST Response:', requestId);

      if (!postResponse.data.request_id) {
        return res.status(500).json({
          success: false,
          message: 'Request ID not received from POST response'
        });
      }

      // Step 2: Send GET request to fetch results
      const getOptions = {
        method: 'GET',
        url: 'https://indian-bank-account-verification.p.rapidapi.com/v3/tasks',
        params: { request_id: requestId },
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEYS!,
          'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com'
        }
      };
      

      const getResponse = await axios.request(getOptions,);
            console.log('GET Response:', getResponse.data);
  
        res.status(200).json({
          success: true,
          message: 'Verification result fetched successfully',
          data: getResponse.data
        });

              
            
     
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during verification'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}