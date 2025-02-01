import { Message } from 'node-nats-streaming';
import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@abticketing21/common';

import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new NotFoundError();
    }
    const { title, price } = data;
    ticket.set({ title, price });

    await ticket.save();
    // acknowledge the message
    msg.ack();
  }
}
