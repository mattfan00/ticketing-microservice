import request from "supertest"
import app from "../../app"
import mongoose from "mongoose"
import Ticket from "../../models/ticket"
import Order, { OrderStatus } from "../../models/order"

const route = "/api/orders"

it("requires users to be authenticated to create an order", async () => {
  await request(app)
    .post(route)
    .send({})
    .expect(401)

  const { cookie } = global.register()
  const response = await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({})

  expect(response.status).not.toBe(401)
})

it("returns 400 if missing fields", async () => {
  const { cookie } = global.register()
  await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      ticketId: ""
    })
    .expect(400)
})

it("returns 404 if ticket trying to be ordered does not exist", async () => {
  const { cookie } = global.register()
  const ticketId = mongoose.Types.ObjectId().toHexString()
  await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      ticketId: ticketId
    })
    .expect(404)
})

it("returns 400 if ticket trying to be ordered is reserved", async () => {
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
  })

  await Order.create({
    userId: "1",
    status: OrderStatus.Created,
    ticket: newTicket.id
  })

  const { cookie } = global.register()
  await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      ticketId: newTicket.id
    })
    .expect(400)
})

it("successfully creates the order", async () => {
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
  })

  await Order.create({
    userId: "1",
    status: OrderStatus.Cancelled,
    ticket: newTicket.id
  })

  const { cookie } = global.register()
  await request(app)
    .post(route)
    .set("Cookie", cookie)
    .send({
      ticketId: newTicket.id
    })
    .expect(200)
})

it.todo("emits an order created event")