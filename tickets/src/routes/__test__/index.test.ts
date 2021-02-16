import request from "supertest"
import app from "../../app"

import Ticket from "../../models/ticket"

it("can fetch a list of tickets", async () => {
  await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: 1
  })
  await Ticket.create({
    title: "another one",
    price: 10,
    userId: 2
  })

  const response = await request(app)
    .get("/api/tickets")
    .send()
    .expect(200)

  expect(response.body.length).toEqual(2)
})