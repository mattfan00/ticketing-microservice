import { Message } from "node-nats-streaming"
import {
  Listener,
  TicketCreatedEvent,
  Subjects
} from "@mattfan00-ticketing/common"

import Ticket from "../../models/ticket"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated
  queueGroupName = "orders-service"

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data

    await Ticket.create({
      _id: id,
      title,
      price
    })

    msg.ack()
  }
}