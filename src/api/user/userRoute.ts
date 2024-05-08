import { Router } from "express";
import errorHandler from "../../config/errorHandler.js";
import usersController from "./userController.js";
import employeeRouter from "./employee/employeeRoute.js";
import motherRouter from "./mother/motherRoute.js";
import { isManager, userAuth } from "../../middlewares/auth.js";
import { upload } from "../../config/multer.js";


const usersRouter:Router = Router();
usersRouter.post('/change/password',[userAuth], errorHandler(usersController.changePassword));
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
usersRouter.post('/forget/password',errorHandler(usersController.forgotPassword))
usersRouter.post('/signup/mother',upload.fields([{ name: "attachments", maxCount: 5 }]),errorHandler(usersController.signup))
usersRouter.post('/confirm/otp',[userAuth],errorHandler(usersController.confirmOtp))
usersRouter.post('/new/password',[userAuth],errorHandler(usersController.newPassword))

export default usersRouter;