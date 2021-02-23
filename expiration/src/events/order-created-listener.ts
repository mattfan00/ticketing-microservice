import {
  Listener,
  Subjects,
  OrderCreatedEvent
} from "@mattfan00-ticketing/common"

import { Message } from "node-nats-streaming"

import { expirationQueue } from "../queues/expiration-queue"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated
  queueGroupName = "expiration-service"

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log(`waiting ${delay} milliseconds`)

    await expirationQueue.add({
      orderId: data.id
    }, {
      delay
    })

    msg.ack()
  }
}
