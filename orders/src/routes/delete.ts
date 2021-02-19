import express, { Request, Response } from "express"
import { NotAuthorizedError, NotFoundError, requireAuth } from "@mattfan00-ticketing/common"

import Order, { OrderStatus } from "../models/order"

const router = express.Router()

router.delete("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
  const foundOrder = await Order.findById(req.params.id)

  if (!foundOrder) {
    throw new NotFoundError()
  }

  if (foundOrder.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  foundOrder.status = OrderStatus.Cancelled
  await foundOrder.save()

  res.json(foundOrder)
})

export { router as deleteOrderRouter }