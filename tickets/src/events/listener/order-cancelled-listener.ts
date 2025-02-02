import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  NotFoundError,
} from '@abticketing21/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket-model';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // const { id:orderId, ticket } = data;

    // Step 1: Find the ticket by ticket ID
    const existingTicket = await Ticket.findById(data.ticket.id);

    if (!existingTicket) {
      throw new NotFoundError();
    }

    // Step 2: Unset the reservation by removing the orderId
    existingTicket.set({ orderId: undefined });

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
