import { Router } from "express";

import errorHandler from "../../../config/errorHandler.js";
import { adminAuth, isAdmin, isEmployee, isReception, isSuperAdmin, userAuth } from "../../../middlewares/auth.js";
import motherController from "./motherController.js";

const motherRouter:Router = Router();

motherRouter.post('/',[userAuth,isReception], errorHandler(motherController.register));
motherRouter.put('/:id',[userAuth,isReception], errorHandler(motherController.update));
motherRouter.delete('/:id',[userAuth,isReception], errorHandler(motherController.delete));
motherRouter.get('/all',[userAuth,], errorHandler(motherController.getAll));
motherRouter.get('/:id',[userAuth], errorHandler(motherController.getSingle));
motherRouter.get('/hs/:id',[userAuth,isEmployee], errorHandler(motherController.getByHs));
motherRouter.get('/hs/my/data', errorHandler(motherController.getByMyHs));

export default motherRouter;