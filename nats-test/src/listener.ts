import nats from "node-nats-streaming"
import { randomBytes } from "crypto"
import TicketCreatedListener from "./events/ticket-created-listener"

console.clear()

const sc = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222"
})

sc.on("connect", () => {
  console.log("listener connected to NATS")

  // Normally NATS will let a service run even if it ended just in case it will get back online
  // This is bad because NATS will send the event to this service, even though its dead
  // It will take a couple of seconds for NATS to realize the service isn't coming back, then it resend it to another one that started
  // This makes it so that if a service dies, NATS will not attempt to send events to it anymore
  // Known as a graceful shutdown
  sc.on("close", () => {
    console.log("NATS connection closed")
    process.exit()
  })

  new TicketCreatedListener(sc).listen()
})

process.on("SIGINT", () => sc.close())
process.on("SIGTERM", () => sc.close())
