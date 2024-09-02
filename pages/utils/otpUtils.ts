// utils/otpUtils.ts

const nodemailer = require('nodemailer')
import OTP from '../models/OTP'; // Assuming you have created an OTP model
import { randomBytes } from 'crypto';

// Function to generate a random OTP
const generateOTP = (): string => {
  return randomBytes(3).toString('hex'); // Generates a 6-digit hexadecimal OTP
};

// Function to send OTP via email
export const sendOTP = async (email: string): Promise<string> => {
  const otp = generateOTP();

  // Save OTP to the database
  await OTP.create({ email, otp });

  // Configure the transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
  console.log(otp);
  

  // Send the email with the OTP
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  });

  return otp;
};

// Function to verify the OTP
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const record = await OTP.findOne({ email, otp });

  if (record) {
    // Optionally, you can delete the OTP record after successful verification
    await OTP.deleteOne({ _id: record._id });
    return true;
  }

  return false;
};