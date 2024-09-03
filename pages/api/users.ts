// pages/api/users.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
});

const User = models.User || model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const users = await User.find({});
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } else {
    res.status(405).end();
  }
}