import { Router } from "express";
const authRouter:Router = Router();
import authController from "../controllers/authController.js";
import errorHandler from "../config/errorHandler.js";
import { adminAuth, isSuperAdmin } from "../middlewares/auth.js";

//routes
authRouter.post("/admin/register",[adminAuth,isSuperAdmin], errorHandler(authController.registerAdmin));
authRouter.post("/user/login", errorHandler(authController.loginUser));
authRouter.post("/admin/login", errorHandler(authController.loginAdmin));

export default authRouter;