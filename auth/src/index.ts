import express from "express"
import "express-async-errors" // so that we can use `throw` in async functions rather than `next()` for errors

import { currentUserRouter }  from "./routes/current-user"
import { loginRouter }  from "./routes/login"
import { logoutRouter }  from "./routes/logout"
import { registerRouter }  from "./routes/register"

import { errorHandler } from "./middleware/error-handler"
import { NotFoundError } from "./errors/not-found-error"

const app = express()
app.use(express.json())

app.use(currentUserRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(registerRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)


app.listen(3000, () => {
  console.log("auth server started on port 3000")
})