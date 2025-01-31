import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
// an interface that describes the properties
// that are required to create a new ticket
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}
// an interface that describes the properties
// that a ticket model has
interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attribute: TicketAttributes): TicketDocument;
}

// an interface that describes the properties
// that a ticket document has
interface TicketDocument extends mongoose.Document<any> {
  title: string;
  price: number;
  userId: string;
  version: number;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};
const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket };
