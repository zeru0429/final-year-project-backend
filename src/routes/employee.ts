import { Router } from "express";
import errorHandler from "../config/errorHandler.js";
import { adminAuth, isAdmin, isSuperAdmin } from "../middlewares/auth.js";
import employeeController from "../controllers/employeeController.js";

const employeeRouter:Router = Router();

employeeRouter.post('/',[adminAuth], errorHandler(employeeController.register));
// employeeRouter.put('/:id',[adminAuth], errorHandler(employeeController.update));
// employeeRouter.delete('/:id',[adminAuth], errorHandler(employeeController.delete));

export default employeeRouter;