import { Router } from "express";
const adminRouter:Router = Router();
import authController from "./adminController.js";
import errorHandler from "../../config/errorHandler.js";
import { adminAuth, isSuperAdmin } from "../../middlewares/auth.js";

//routes
adminRouter.post("/login", errorHandler(authController.loginAdmin));
adminRouter.post("/register",[adminAuth,isSuperAdmin], errorHandler(authController.registerAdmin));
adminRouter.get('/me',[adminAuth,isSuperAdmin], errorHandler(authController.myInfo));

export default adminRouter;