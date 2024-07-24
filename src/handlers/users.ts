import { type Request, type Response } from "express";
import db from "../db";
import type User from "../types/User";
import { hashPassword, verifyPassword } from "../util/hash";
import handleHttpErrors from "../util/handleHttpErrors";

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
