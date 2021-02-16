import request from "supertest"
import app from "../../app"
import mongoose from "mongoose"

import Ticket from "../../models/ticket"

it("returns a 404 if a ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})

it("returns the ticket if the ticket is found", async () => {
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: "1"
  })

  const response = await request(app)
    .get(`/api/tickets/${newTicket.id}`)
    .send()
    .expect(200)

  expect(response.body.title).toEqual(newTicket.title)
  expect(response.body.price).toEqual(newTicket.price)
  expect(response.body.userId).toEqual(newTicket.userId)
})