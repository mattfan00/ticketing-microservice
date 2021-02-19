import express, { Request, Response } from "express"
import { body } from "express-validator"
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError
} from "@mattfan00-ticketing/common"

import Order, { OrderStatus } from "../models/order"
import Ticket from "../models/ticket"

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post("/api/orders", requireAuth, [
  body("ticketId")
    .not()
    .isEmpty()
    .withMessage("TicketId must be provided")
], validateRequest, async (req: Request, res: Response) => {
  // Find the ticket the user is trying to purchase
  const { ticketId } = req.body
  const foundTicket = await Ticket.findById(ticketId)

  if (!foundTicket) {
    throw new NotFoundError()
  }

  // Make sure the ticket is not reserved
  if (await foundTicket.isReserved()) {
    throw new BadRequestError("Ticket is already reserved")
  }

  // Create an expiration date for the order
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  // Build the order and save it to the database
  const createdOrder = Order.create({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: foundTicket.id
  })

  // Publish an event saying that an order was created

  res.json(createdOrder)
})

export { router as createOrderRouter }