import mongoose from 'mongoose';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order-model';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteEvent, OrderStatus } from '@abticketing21/common';

const setup = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100,
  });
  await ticket.save();

  // Create an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'testUserId',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Create fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('acknowledges the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
