import mongoose, { Document } from "mongoose"

export interface TicketInterface extends Document {
  title: string,
  price: number,
  userId: string,
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
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
    versionKey: false
  }
})

export default mongoose.model<TicketInterface>("Ticket", ticketSchema)
