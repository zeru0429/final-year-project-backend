import { Router } from "express";
import hsController from "./hsController.js";
import errorHandler from "../../config/errorHandler.js";
import { adminAuth, isAdmin, isSuperAdmin } from "../../middlewares/auth.js";

const healthStationRouter:Router = Router();

healthStationRouter.post('/',[adminAuth], errorHandler(hsController.register));
healthStationRouter.put('/:id',[adminAuth], errorHandler(hsController.update));
healthStationRouter.delete('/:id',[adminAuth], errorHandler(hsController.delete));

export default healthStationRouter;