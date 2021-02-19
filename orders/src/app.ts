import express from "express"
import "express-async-errors" // so that we can use `throw` in async functions rather than `next()` for errors
import cookieSession from "cookie-session"

import { errorHandler, NotFoundError, currentUser } from "@mattfan00-ticketing/common"

import { createOrderRouter } from "./routes/new"
import { showOrderRouter } from "./routes/show"
import { indexOrderRouter } from "./routes/index"
import { deleteOrderRouter } from "./routes/delete"

const app = express()
app.set("trust proxy", true)
app.use(express.json())
app.use(cookieSession({
  // disable encryption because JWT is already encrypted
  signed: false,
  // needs to be a https request to set cookie / remove precaution when running tests
  secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUser)

app.use(createOrderRouter)
app.use(indexOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app