import express, { Request, Response } from "express"
import { NotAuthorizedError, NotFoundError, requireAuth } from "@mattfan00-ticketing/common"

import Order, { OrderStatus } from "../models/order"

import { natsWrapper } from "../nats-wrapper"
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher"

const router = express.Router()

router.delete("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
  const foundOrder = await Order.findById(req.params.id).populate("ticket")

  if (!foundOrder) {
    throw new NotFoundError()
  }

  if (foundOrder.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  foundOrder.status = OrderStatus.Cancelled
  await foundOrder.save()

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: foundOrder.id,
    version: foundOrder.version,
    ticket: {
      id: foundOrder.ticket.id
    }
  })

  res.json(foundOrder)
})

export { router as deleteOrderRouter }