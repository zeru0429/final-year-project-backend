import { Router } from "express";
const authRouter:Router = Router();
import authController from "../controllers/authController.js";
import errorHandler from "../config/errorHandler.js";

//routes
authRouter.post("/signup", errorHandler(authController.signup));
authRouter.post("/login", errorHandler(authController.login));


export default authRouter;