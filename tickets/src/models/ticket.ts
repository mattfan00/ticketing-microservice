import mongoose, { Document } from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

export interface TicketInterface extends Document {
  title: string
  price: number
  userId: string
  orderId?: string
  version: number
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)

export default mongoose.model<TicketInterface>("Ticket", ticketSchema)
