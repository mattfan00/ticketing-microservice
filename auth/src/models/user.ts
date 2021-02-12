import mongoose, { Document } from "mongoose"
import Password from "../services/password"

export interface UserInterface extends Document {
  email: string,
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre("save", async function(done) {
  let user = this

  // Only hash the password if it has been modified
  if (user.isModified("password")) {
    const newHash = await Password.toHash(user.get("password"))
    user.set("password", newHash)
  }
  done()
})

export default mongoose.model<UserInterface>("User", userSchema)
