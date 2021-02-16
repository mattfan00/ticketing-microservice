import request from "supertest"
import app from "../../app"

import Ticket from "../../models/ticket"

it("can only be accessed if the user is signed in", async () => {
  await request(app)
    .post("/api/tickets")
    .send({})
    .expect(401)

  // User should be authenticated now
  const { cookie }= global.register()
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({})

  expect(response.status).not.toBe(401)
})

it("returns an error if an invalid field is provided", async () => {
  const { cookie } = global.register()
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10
    })
    .expect(400)

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 10
    })
    .expect(400)

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "testing title",
      price: -1
    })
    .expect(400)

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "testing title"
    })
    .expect(400)
})


it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const newTicket = {
    title: "my item",
    price: 10
  }

  const { cookie } = global.register()
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(newTicket)
    .expect(200)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual(newTicket.title)
  expect(tickets[0].price).toEqual(newTicket.price)
  expect(response.body.title).toEqual(newTicket.title)
  expect(response.body.price).toEqual(newTicket.price)
})