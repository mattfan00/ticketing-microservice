import { Publisher, OrderCreatedEvent, Subjects } from "@mattfan00-ticketing/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated
}
