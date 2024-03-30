import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import usersController from "./userController.js";
import employeeRouter from "./employee/employeeRoute.js";
import motherRouter from "./mother/motherRoute.js";


const usersRouter:Router = Router();
usersRouter.use('/employee',employeeRouter)
usersRouter.use('/mother',motherRouter)

usersRouter.use('/login',errorHandler(usersController.loginUser))

usersRouter.post('/',[userAuth], errorHandler(usersController.changePassword));
usersRouter.put('/:id',[userAuth], errorHandler(usersController.updatedEmailAndPhone));
usersRouter.delete('/:id',[userAuth], errorHandler(usersController.delete));
usersRouter.get('/',[userAuth], errorHandler(usersController.getAll));
usersRouter.get('/:id',[userAuth], errorHandler(usersController.getSingle));
usersRouter.get('/:hsId',[userAuth], errorHandler(usersController.getByHs));

export default usersRouter;