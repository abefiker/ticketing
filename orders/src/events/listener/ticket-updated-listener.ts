import { Message } from 'node-nats-streaming';
import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdateEvent,
} from '@abticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
export class TicketUpdatedListener extends Listener<TicketUpdateEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdateEvent['data'], msg: Message) {
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
