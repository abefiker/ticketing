import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { rejects } from 'assert';

interface Event {
  subjects: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subjects: T['subjects'];
  constructor(private client: Stan) {}

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.client.publish(this.subjects, JSON.stringify(data), (err) => {
        if (err) {
          return rejects(err);
        }
        console.log('Event Published to Subject: ', this.subjects);
        resolve();
      });
    });
  }
}
