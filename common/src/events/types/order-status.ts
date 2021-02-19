export enum OrderStatus {
  // When order is created, but ticket is not reserved
  Created = "created",
  // The ticket being reserved has been reserved already,
  // or user cancelled order,
  // or the order expires before payment
  Cancelled = "cancelled",
  // The order has successfully reserved the ticket
  AwaitingPayment = "awaiting:payment",
  // The order reserved the ticket and the user paid
  Complete = "complete"
}