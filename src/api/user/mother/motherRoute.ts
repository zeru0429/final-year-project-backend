import { Router } from "express";

import errorHandler from "../../../config/errorHandler.js";
import {
  adminAuth,
  isAdmin,
  isEmployee,
  isReception,
  isSuperAdmin,
  userAuth,
} from "../../../middlewares/auth.js";
import motherController from "./motherController.js";

const motherRouter: Router = Router();

motherRouter.get(
  "/hs/my",
  [userAuth, isEmployee],
  errorHandler(motherController.getByMyHs)
);

motherRouter.get(
  "/all",
  [userAuth, isEmployee],
  errorHandler(motherController.getAll)
);

motherRouter.get("/:id", [userAuth], errorHandler(motherController.getSingle));

motherRouter.post(
  "/",
  [userAuth, isReception],
  errorHandler(motherController.register)
);
motherRouter.put(
  "/:id",
  [userAuth, isReception],
  errorHandler(motherController.update)
);
motherRouter.delete(
  "/:id",
  [userAuth, isReception],
  errorHandler(motherController.delete)
);

export default motherRouter;
