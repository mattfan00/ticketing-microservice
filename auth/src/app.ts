import express from "express"
import "express-async-errors" // so that we can use `throw` in async functions rather than `next()` for errors
import cookieSession from "cookie-session"

import { currentUserRouter }  from "./routes/current-user"
import { loginRouter }  from "./routes/login"
import { logoutRouter }  from "./routes/logout"
import { registerRouter }  from "./routes/register"

import { errorHandler } from "./middleware/error-handler"
import { NotFoundError } from "./errors/not-found-error"

const app = express()
app.set("trust proxy", true)
app.use(express.json())
app.use(cookieSession({
  // disable encryption because JWT is already encrypted
  signed: false,
  // needs to be a https request to set cookie / remove precaution when running tests
  secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUserRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(registerRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app