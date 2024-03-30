import { Router } from "express";
import { userAuth } from "../../../middlewares/auth.js";
import errorHandler from "../../../config/errorHandler.js";
import hsInfoController from "./hsInfoController.js";


const healthStationInfoRouter:Router = Router();

healthStationInfoRouter.post('/',[userAuth], errorHandler(hsInfoController.register));
healthStationInfoRouter.put('/:id',[userAuth], errorHandler(hsInfoController.update));
healthStationInfoRouter.delete('/:id',[userAuth], errorHandler(hsInfoController.delete));

healthStationInfoRouter.get('/',[userAuth], errorHandler(hsInfoController.getAll));
healthStationInfoRouter.get('/:id', errorHandler(hsInfoController.getSingle));
healthStationInfoRouter.get('/hs/:hsId', errorHandler(hsInfoController.getByHs));
healthStationInfoRouter.get('/detail/', errorHandler(hsInfoController.getAllDetaile));
healthStationInfoRouter.get('/detail/:hsId', errorHandler(hsInfoController.getSingleDetaile));

export default healthStationInfoRouter;