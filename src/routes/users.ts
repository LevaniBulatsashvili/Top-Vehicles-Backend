import { Router } from "express";
import { loginUser, registerUser } from "../handlers/users";

const usersRouter = Router();

usersRouter.post("/login", loginUser);
usersRouter.post("/register", registerUser);

export default usersRouter;
