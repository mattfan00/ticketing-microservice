import express, { Request, Response } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"

import User from "../models/user"

import Password from "../services/password"
import { validateRequest } from "../middleware/validate-request"

import { BadRequestError } from "../errors/bad-request-error"

const router = express.Router()

router.post("/api/users/login", [
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must supply a password")
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    throw new BadRequestError("Invalid credentials")
  }

  const passwordsMatch = await Password.compare(existingUser.password, password)
  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials")
  }

  // Create JWT token
  const newJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!)

  // Store in session
  req.session = {
    jwt: newJwt
  }

  res.json(existingUser)
})

export { router as loginRouter}