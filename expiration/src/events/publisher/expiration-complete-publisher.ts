import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@abticketing21/common';
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subjects: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

