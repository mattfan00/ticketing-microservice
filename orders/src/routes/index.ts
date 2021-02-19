import express, { Request, Response } from "express"
import { requireAuth } from "@mattfan00-ticketing/common"
import Order from "../models/order"

const router = express.Router()

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const foundOrders = await Order.find({ userId: req.currentUser!.id })
    .populate("ticket")

  res.json(foundOrders)
})

export { router as indexOrderRouter }