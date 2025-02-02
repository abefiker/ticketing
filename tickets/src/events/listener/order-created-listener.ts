import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  NotFoundError,
} from '@abticketing21/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket-model';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // const { id: orderId, ticket } = data;
    // Step 1: Find the ticket that the order is reserving
    const existingTicket = await Ticket.findById(data.ticket.id);
    if (!existingTicket) {
      throw new NotFoundError();
    }
    // Step 2: Mark the ticket as reserved by setting the orderId
    existingTicket.set({ orderId: data.id });
    // Step 3: Save the ticket
    await existingTicket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: existingTicket.id,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      version: existingTicket.version,
      orderId: existingTicket.orderId,
    });
    // Step 4: Acknowledge the message
    msg.ack();
  }
}
