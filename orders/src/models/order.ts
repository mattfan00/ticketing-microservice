import mongoose, { Document } from "mongoose"
import { OrderStatus } from "@mattfan00-ticketing/common"
import { TicketInterface } from "./ticket"

export { OrderStatus }

export interface OrderInterface extends Document {
  userId: string,
  status: OrderStatus,
  expiresAt: Date,
  ticket: TicketInterface
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket"
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

export default mongoose.model<OrderInterface>("Order", orderSchema)
