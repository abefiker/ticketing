import mongoose from 'mongoose';
import { app } from './app';
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable is missing');
  }
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL environment variable is missing');
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
  } catch (err) {
    console.log(`Error: ${err}`);
  }
  app.listen(3000, () => {
    console.log('Auth service running on port 3000');
  });
};
start();
