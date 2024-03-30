import { Router } from "express";

import errorHandler from "../../../config/errorHandler.js";
import { adminAuth, isAdmin, isSuperAdmin, userAuth } from "../../../middlewares/auth.js";
import motherController from "./motherController.js";

const motherRouter:Router = Router();

motherRouter.post('/',[userAuth], errorHandler(motherController.register));
motherRouter.put('/:id',[userAuth], errorHandler(motherController.update));
motherRouter.delete('/:id',[userAuth], errorHandler(motherController.delete));
motherRouter.get('/',[userAuth], errorHandler(motherController.getAll));
motherRouter.get('/:id',[userAuth], errorHandler(motherController.getSingle));
motherRouter.get('/hs/:id',[userAuth], errorHandler(motherController.getByHs));

export default motherRouter;