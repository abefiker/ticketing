import Queue from 'bull';
interface Payload {
  orderId: string;
}
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});

expirationQueue.process(async (job) => {
  console.log(
    'i want to publish an expiration:complete event for orderId',
    job.data.orderId
  );
});

export { expirationQueue };
