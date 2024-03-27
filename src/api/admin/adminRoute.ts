import { Router } from "express";
const adminRouter:Router = Router();
import authController from "./adminController.js";
import errorHandler from "../../config/errorHandler.js";
import { adminAuth, isSuperAdmin } from "../../middlewares/auth.js";

//routes
adminRouter.post("/register",[adminAuth,isSuperAdmin], errorHandler(authController.registerAdmin));
// adminRouter.post("/user/login", errorHandler(authController.loginUser));
adminRouter.post("/login", errorHandler(authController.loginAdmin));

export default adminRouter;