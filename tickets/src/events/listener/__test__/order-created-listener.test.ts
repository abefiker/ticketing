import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderStatus } from '@abticketing21/common';
import { Ticket } from '../../../models/ticket-model';
import mongoose from 'mongoose';
const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  // create a fake data event
  // @ts-ignore
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
    version: 0,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket };
};
it('', async () => {
  const { listener, data, msg, ticket } = await setup();
});
