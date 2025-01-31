import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './event/ticket-created-publisher';
console.clear();
const stan = nats.connect('ticketing', 'abe', {
  url: 'http://localhost:4222',
});
stan.on('connect', async () => {
  console.log('Publisher Connected to NATS');
  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: '1234',
    title: 'concert',
    price: 20,
  });
  // const data = JSON.stringify({
  //   id: '1234',
  //   title: 'concert',
  //   price: 20,
  // });
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event Published');
  // });
});
