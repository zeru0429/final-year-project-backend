import { Router } from "express";
import { userAuth } from "../../../middlewares/auth.js";
import errorHandler from "../../../config/errorHandler.js";
import hsInfoController from "./hsInfoController.js";


const healthStationRouter:Router = Router();

healthStationRouter.post('/',[userAuth], errorHandler(hsInfoController.register));
healthStationRouter.put('/:id',[userAuth], errorHandler(hsInfoController.update));
healthStationRouter.delete('/:id',[userAuth], errorHandler(hsInfoController.delete));
healthStationRouter.get('/', errorHandler(hsInfoController.getAll));
healthStationRouter.get('/:id', errorHandler(hsInfoController.getSingle));
healthStationRouter.get('/:hsId', errorHandler(hsInfoController.getByHs));

healthStationRouter.get('/', errorHandler(hsInfoController.getAllDetaile));
healthStationRouter.get('/:hsId', errorHandler(hsInfoController.getSingleDetaile));

export default healthStationRouter;