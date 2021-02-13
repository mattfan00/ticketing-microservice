import express, { Request, Response } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"

import { validateRequest } from "../middleware/validate-request"

import User from "../models/user"

import { BadRequestError } from "../errors/bad-request-error"


const router = express.Router()

router.post("/api/users/register", [
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20})
    .withMessage("Password must be within 4 and 20 characters")
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new BadRequestError("Email already in use")
  }

  const user = await User.create({ email, password })

  // Create JWT token
  const newJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!)

  // Store in session
  req.session = {
    jwt: newJwt
  }

  res.json(user)
})

export { router as registerRouter}