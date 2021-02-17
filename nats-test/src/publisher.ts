/// <reference types="node" />

import nats from "node-nats-streaming"
import { randomBytes } from "crypto"
import TicketCreatedPublisher from "./events/ticket-created-publisher"

console.clear()

const sc = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222"
})

sc.on("connect", async () => {
  console.log("publisher connected to NATS")

  const publisher = new TicketCreatedPublisher(sc)
  await publisher.publish({
    id: "1",
    title: "concert",
    price: 20
  })
  console.log("hey")

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20
  // })

  // sc.publish("ticket:created", data, () => {
  //   console.log("event published")
  // })
})