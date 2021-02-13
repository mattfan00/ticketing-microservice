import bcrypt from "bcrypt"

export default class Password {
  private static saltRounds = 10

  static async toHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }

  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    return await bcrypt.compare(suppliedPassword, storedPassword)
  }
}
