import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto';
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable is missing');
  }
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL environment variable is missing');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID environment variable is missing');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID environment variable is missing');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL environment variable is missing');
  }

  try {
    // Connect to NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('disconnect', () => {
      console.log('NATS disconnected');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
  } catch (err) {
    console.log(`Error: ${err}`);
  }
  app.listen(3000, () => {
    console.log('Tickets service running on port 3000');
  });
};
start();
