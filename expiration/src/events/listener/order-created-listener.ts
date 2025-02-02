import { Listener, Subjects, OrderCreatedEvent } from '@abticketing21/common';
import { expirationQueue } from '../../queues/expiration-queue';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, expiresAt } = data;
    const delay = new Date(expiresAt).getTime() - new Date().getTime();
    console.log('waiting this milliseconds to process the job ', delay);
    await expirationQueue.add(
      { orderId: id },
      {
        delay,
      }
    );
    msg.ack(); // Acknowledge the message to be removed from the queue
  }
}
