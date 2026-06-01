const bcrypt = require("bcrypt");

import { IHashProvider } from "./IHashProvider.js";

export class BcryptHashProvider implements IHashProvider {
  async hash(payload: string): Promise<string> {
    return bcrypt.hash(payload, 6);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}
