import { Router } from "express";
import errorHandler from "../../../config/errorHandler.js";
import { adminAuth, isAdmin, isSuperAdmin, userAuth } from "../../../middlewares/auth.js";
import employeeController from "./employeeController.js";

const employeeRouter:Router = Router();

employeeRouter.post('/',[adminAuth,isAdmin], errorHandler(employeeController.register));
employeeRouter.put('/:id',[userAuth], errorHandler(employeeController.update));
employeeRouter.delete('/:id',[userAuth], errorHandler(employeeController.delete));

employeeRouter.get('/',[userAuth], errorHandler(employeeController.getAll));
employeeRouter.get('/:id',[userAuth], errorHandler(employeeController.getSingle));
employeeRouter.get('/hs/:id',[userAuth], errorHandler(employeeController.getByHs));
employeeRouter.put('/updateStatus/:id',[userAuth], errorHandler(employeeController.updateStatus));
employeeRouter.put('/assignrole/:id',[userAuth], errorHandler(employeeController.assignRole));

export default employeeRouter;