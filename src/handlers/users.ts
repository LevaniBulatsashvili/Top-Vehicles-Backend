import { type Request, type Response } from "express";
import db from "../db";
import type User from "../types/User";
import { hashPassword, verifyPassword } from "../util/hash";
import handleHttpErrors from "../util/handleHttpErrors";

export async function loginUser(req: Request<{}, {}, User>, res: Response) {
  try {
    const { email, password } = req.body;
    const user: User | undefined = (
      await db.query(`SELECT * FROM users WHERE email = '${email}'`)
    ).rows[0];
    if (user === undefined)
      res.status(404).json({ message: "User doesn't exist" });
    else if (!verifyPassword(user.password, password))
      res.status(401).json({ message: "Incorrect password" });
    else res.status(200).json({ id: user.id, email: user.email });
  } catch (err) {
    handleHttpErrors(res, err);
  }
}

export async function registerUser(req: Request<{}, {}, User>, res: Response) {
  try {
    const { email, password } = req.body;
    await db.query("INSERT INTO users (email, password) VALUES($1, $2)", [
      email,
      hashPassword(password),
    ]);

    res.status(200).json({ message: "success" });
  } catch (err) {
    handleHttpErrors(res, err);
  }
}
