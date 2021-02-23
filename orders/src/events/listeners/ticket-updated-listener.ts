import { Message } from "node-nats-streaming"
import {
  Listener,
  TicketUpdatedEvent,
  Subjects
} from "@mattfan00-ticketing/common"

import Ticket from "../../models/ticket"

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated
  queueGroupName = "orders-service"

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data
    const foundTicket = await Ticket.findByEvent({ id, version })

    if (!foundTicket) {
      throw new Error("ticket not found")
    }

    foundTicket.set({
      title,
      price
    })

    await foundTicket.save()

    msg.ack()
  }
}