import { Router } from "express";
import errorHandler from "../../config/errorHandler.js";
import usersController from "./userController.js";
import employeeRouter from "./employee/employeeRoute.js";
import motherRouter from "./mother/motherRoute.js";
import { isManager, userAuth } from "../../middlewares/auth.js";


const usersRouter:Router = Router();

usersRouter.post('/',[userAuth], errorHandler(usersController.changePassword));
usersRouter.put('/:id',[userAuth], errorHandler(usersController.updatedEmailAndPhone));
usersRouter.delete('/:id',[userAuth], errorHandler(usersController.delete));
//get all the users and get a specific user
usersRouter.get('/',[userAuth], errorHandler(usersController.getAll));
usersRouter.get('/:id',[userAuth], errorHandler(usersController.getSingle));
usersRouter.get('/:hsId',[userAuth], errorHandler(usersController.getByHs));
usersRouter.get('/me/myInfo',[userAuth], errorHandler(usersController.myInfo));

usersRouter.use('/employee',employeeRouter)
usersRouter.use('/mother',motherRouter)
usersRouter.use('/login',errorHandler(usersController.loginUser))

export default usersRouter;