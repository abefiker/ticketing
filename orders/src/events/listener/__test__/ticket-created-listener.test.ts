import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@abticketing21/common';
import mongoose from 'mongoose';
const setup = () => {
  // create a instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create fake  data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};
it('creates and saves a tickets', async () => {
  const { listener, data, msg } = setup();
  // call the onMessage function with the data + message object
  await listener.onMessage(data, msg);
  // write asserstion to make sure ticket is created and saved
  const ticket = await Ticket.findById(data.id)
  // write asserstion to make sure a ticket was created
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
});
it('ack the message', async () => {
    const { listener, data, msg } = setup();
  // call the onMessage function with the data + message object
  await listener.onMessage(data, msg);
  // write asserstion to make sure ack fuction is called
  expect(msg.ack).toHaveBeenCalled();
});
