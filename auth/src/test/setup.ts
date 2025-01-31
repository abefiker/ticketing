import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer; // Use the correct type for `mongo`

beforeAll(async () => {
  mongo = await MongoMemoryServer.create(); // Create an in-memory MongoDB server
  process.env.JWT_KEY = 'asdf'; // Set a JWT secret for tests
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({}); // Clear all collections before each test
    }
  }
});

afterAll(async () => {
  await mongo.stop(); // Stop the in-memory MongoDB server
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(); // Close the connection
  }
});
