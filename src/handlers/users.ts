import { type Request, type Response } from "express";
import db from "../db";
import type User from "../types/User";

export async function registerUser(req: Request<{}, {}, User>, res: Response) {
  const { email, password } = req.body;

  try {
    await db.query("INSERT INTO users (email, password) VALUES($1, $2)", [
      email,
      password,
    ]);

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
}
