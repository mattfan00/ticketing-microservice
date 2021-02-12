import bcrypt from "bcrypt"

export default class Password {
  private static saltRounds = 10

  static async toHash(password: string) {
    const hash = await bcrypt.hash(password, this.saltRounds)
    return hash
  }

  static compare(storedPassword: string, suppliedPassword: string) {

  }
}
