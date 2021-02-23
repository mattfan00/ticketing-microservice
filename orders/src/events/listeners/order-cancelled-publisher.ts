import {
  Publisher,
  Subjects,
  OrderCancelledEvent
} from "@mattfan00-ticketing/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled
}