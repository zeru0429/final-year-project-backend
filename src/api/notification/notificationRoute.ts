import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import notificationController from "./notificationController.js";


const notificationRouter:Router = Router();

notificationRouter.post('/',[userAuth], errorHandler(notificationController.register));
notificationRouter.put('/:id',[userAuth], errorHandler(notificationController.update));
notificationRouter.put('/seen/:id',[userAuth], errorHandler(notificationController.seenupdate));
notificationRouter.delete('/:id',[userAuth], errorHandler(notificationController.delete));

// Get all children of a specific parent or
notificationRouter.get('/:id',[userAuth], errorHandler(notificationController.getSingle));
notificationRouter.get('/',[userAuth], errorHandler(notificationController.getAll));
notificationRouter.get('/getmy/data',[userAuth], errorHandler(notificationController.getMy));
export default notificationRouter;