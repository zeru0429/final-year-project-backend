import { Router } from "express";

import errorHandler from "../config/errorHandler.js";
import { adminAuth, isAdmin, isSuperAdmin, userAuth } from "../middlewares/auth.js";
import motherController from "../controllers/motherController.js";

const motherRouter:Router = Router();

motherRouter.post('/',[userAuth], errorHandler(motherController.register));
// motherRouter.put('/:id',[adminAuth], errorHandler(motherController.update));
// motherRouter.delete('/:id',[adminAuth], errorHandler(motherController.delete));

export default motherRouter;