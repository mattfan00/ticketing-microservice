import mongoose, { Document, Model } from "mongoose"
import Order, { OrderStatus } from "../models/order"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

export interface TicketInterface extends Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModelInterface extends Model<TicketInterface> {
  findByEvent(event: { id: string, version: number}): Promise<TicketInterface | null>
}

const ticketSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
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

ticketSchema.statics.findByEvent = function (event: { id: string, version: number}) {
    return this.findOne({
      _id: event.id,
      // solve concurrency issues
      version: event.version - 1
    })
}

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

ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)

export default mongoose.model<TicketInterface, TicketModelInterface>("Ticket", ticketSchema)