import mongoose, { Document } from "mongoose"
import Order, { OrderStatus } from "../models/order"

export interface TicketInterface extends Document {
  title: string,
  price: number,
  isReserved(): Promise<boolean>
}

const ticketSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

ticketSchema.methods.isReserved = async function() {
  const foundOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ]
    }
  })

  return foundOrder ? true: false
}

export default mongoose.model<TicketInterface>("Ticket", ticketSchema)