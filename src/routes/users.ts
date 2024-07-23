import { Router } from "express";
import { registerUser } from "../handlers/users";

const usersRouter = Router();

usersRouter.post("/register", registerUser);

export default usersRouter;
