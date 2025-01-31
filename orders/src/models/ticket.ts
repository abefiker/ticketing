import mongoose from 'mongoose';
import { OrderStatus } from '@abticketing/common';
import { Order } from './order-model';

interface TicketAttrs {
  title: string;
  price: number;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(atts: TicketAttrs): TicketDoc;
}
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
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
schema.statics.build = (atts: TicketAttrs) => {
  return new Ticket(atts);
};
// Run Query to look at all orders. Find an order where the ticket
// is the ticket  we just found *and* the orders status is *not* cancelled.
// if we found the order from this means the ticket *is* reserved
// calculate the expiration date for the order
schema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', schema);
export { Ticket };
