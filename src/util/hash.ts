import crypto from "node:crypto";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.scryptSync(password, salt, 64);

  return hashedPassword.toString("hex") + ":" + salt;
}

export function verifyPassword(storedPassword: string, password: string) {
  const [hashedPassword, salt] = storedPassword.split(":");
  const storedPasswordBuffer = Buffer.from(hashedPassword, "hex");
  const passwordBuffer = crypto.scryptSync(password, salt, 64);

  return crypto.timingSafeEqual(storedPasswordBuffer, passwordBuffer);
}
