import { type Response } from "express";

function response(res: Response, status: number, message: string) {
  res.status(status).json({ message });
}

export default function handleHttpErrors(res: Response, error: unknown) {
  if (error instanceof Error) {
    const err = error.message;
    if (err.includes("does not exist"))
      return response(res, 404, "Requested resource doesn't exist.");
    if (err.includes("violates foreign key constraint"))
      return response(res, 404, "Resource doesn't exist.");
    if (err.includes("violates not-null constraint"))
      return response(res, 422, "Request is missing data.");
    if (err.includes("invalid input syntax for type"))
      return response(res, 422, "Request contains wrong data types.");
    if (err.includes('unique constraint "users_email_key"'))
      return response(res, 422, "Email already exists.");
  }
  res
    .status(500)
    .json({ message: "Oops something went wrong please try again." });
}
