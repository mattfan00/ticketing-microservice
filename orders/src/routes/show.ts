import express, { Request, Response } from "express"
import { NotAuthorizedError, NotFoundError, requireAuth } from "@mattfan00-ticketing/common"

import Order from "../models/order"

const router = express.Router()

router.get("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
  const foundOrder = await Order.findById(req.params.id)
    .populate("ticket")

  if (!foundOrder) {
    throw new NotFoundError()
  }

  if (foundOrder.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  res.json(foundOrder)
})

export { router as showOrderRouter }