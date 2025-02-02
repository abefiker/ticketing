import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket-model';
import { OrderCreatedEvent, OrderStatus } from '@abticketing21/common';
import { Message } from 'node-nats-streaming';

// Setup function to prepare test instances
const setup = async () => {
  // Create an instance of the listener for OrderCreated events
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Build and save a sample ticket to the database
  const ticket = Ticket.build({
    title: 'concert', // Set ticket title
    price: 20, // Set ticket price
    userId: new mongoose.Types.ObjectId().toHexString(), // Create a dummy user ID
  });
  await ticket.save(); // Save the ticket in the test database

  // Create a fake OrderCreated event data
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(), // Random order ID
    status: OrderStatus.Created, // Order status set as created
    userId: new mongoose.Types.ObjectId().toHexString(), // Random user ID
    expiresAt: new Date().toISOString(), // Expiration timestamp
    version: 0, // Event version
    ticket: {
      id: ticket.id, // Ticket associated with the order
      price: ticket.price, // Ticket price
    },
  };

  // Create a fake Message object for NATS streaming
  // @ts-ignore to suppress type warnings
  const msg: Message = {
    ack: jest.fn(), // Mock the acknowledgment function
  };

  // Return listener, data, msg, and ticket for testing
  return { listener, data, msg, ticket };
};

// Test 1: Verify if the ticket is reserved by setting orderId
it('reserves a ticket by setting the orderId', async () => {
  const { listener, data, msg, ticket } = await setup();

  // Call onMessage with the fake data and message
  await listener.onMessage(data, msg);

  // Fetch the updated ticket from the database
  const updatedTicket = await Ticket.findById(ticket.id);

  // Check if the orderId is correctly set on the ticket
  expect(updatedTicket!.orderId).toEqual(data.id);
});

// Test 2: Verify if the message acknowledgment is successful
it('acks the message successfully', async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage with the fake data and message
  await listener.onMessage(data, msg);

  // Ensure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

// Test 3: Handle case when ticket is not found
it('throws an error if the ticket is not found', async () => {
  const { listener, data, msg } = await setup();

  // Set a non-existent ticket ID
  data.ticket.id = new mongoose.Types.ObjectId().toHexString();

  await expect(listener.onMessage(data, msg)).rejects.toThrow();

  // Ensure ack function is NOT called when an error occurs
  expect(msg.ack).not.toHaveBeenCalled();
});

it('publish a ticket updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // @ts-ignore
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
