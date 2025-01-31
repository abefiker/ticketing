import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher Connected to NATS Streaming Server');
  const ticketCreatedPublisher = new TicketCreatedPublisher(stan);
  try {
    await ticketCreatedPublisher.publish({
      id: '123',
      title: 'Test Event',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'Test Event',
  //   price: 20,
  // });
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event created successfully');
  // });
});
