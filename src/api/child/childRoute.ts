import { Router } from "express";

import childController from "./childController.js";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";

const childRouter:Router = Router();

childRouter.post('/',[userAuth], errorHandler(childController.register));
childRouter.put('/:id',[userAuth], errorHandler(childController.update));
childRouter.delete('/:id',[userAuth], errorHandler(childController.delete));
childRouter.get('/',[userAuth], errorHandler(childController.getAll));
childRouter.get('/:id',[userAuth], errorHandler(childController.getSingle));
childRouter.get('/:hsId',[userAuth], errorHandler(childController.getByHs));

export default childRouter;