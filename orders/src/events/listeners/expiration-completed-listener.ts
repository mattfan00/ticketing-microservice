import {
  Listener,
  Subjects,
  ExpirationCompletedEvent
} from "@mattfan00-ticketing/common"

import { Message } from "node-nats-streaming"
import Order, { OrderStatus } from "../../models/order"
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher"
import { natsWrapper } from "../../nats-wrapper"

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: ExpirationCompletedEvent["subject"] = Subjects.ExpirationCompleted
  queueGroupName = "orders-service"

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const foundOrder = await Order.findById(data.orderId).populate("ticket")

    if (!foundOrder) {
      throw new Error("Order not found")
    }

    // don't cancel an order that has already been completed
    if (foundOrder.status === OrderStatus.Complete) {
      return msg.ack()
    }

    foundOrder.set({
      status: OrderStatus.Cancelled
    })
    await foundOrder.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: foundOrder.id,
      version: foundOrder.version,
      ticket: {
        id: foundOrder.ticket.id
      }
    })

    msg.ack()
  }
}