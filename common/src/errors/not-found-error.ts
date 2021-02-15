import { CustomError } from "./custom-error"

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor() {
    super("Invalid route")

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [
      { message: "Invalid route"}
    ]
  }
}