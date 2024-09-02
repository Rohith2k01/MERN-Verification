import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for OTP document
interface IOTP extends Document {
  email: string;
  otp: string;
}

// Define the OTP schema
const otpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
});

// Define and export the OTP model
const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', otpSchema);

export default OTP;