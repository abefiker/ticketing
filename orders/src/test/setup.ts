import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');
let mongo: MongoMemoryServer; // Reference to the in-memory MongoDB instance

// Extend the global type declaration
declare global {
  // sourcery skip: avoid-using-var
  var signin: () => string[]; // Add `signin` to the global scope
}
export {};

// Run before all tests
beforeAll(async () => {
  // Start the in-memory MongoDB server
  mongo = await MongoMemoryServer.create();

  // Set a JWT secret for test purposes
  process.env.JWT_KEY = 'asdf';

  // Connect to the in-memory MongoDB server
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

// Run before each test
beforeEach(async () => {
  jest.clearAllMocks();
  // Clear all collections to ensure test isolation
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Run after all tests
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.disconnect();
});

// Define the global `signin` function for test authentication
global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Convert session to JSON and encode as base64
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return the cookie as an array
  return [`session=${base64}`];
};
