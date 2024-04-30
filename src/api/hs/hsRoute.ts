import { Router } from "express";
import hsController from "./hsController.js";
import errorHandler from "../../config/errorHandler.js";
import {
  adminAuth,
  isAdmin,
  isSuperAdmin,
  userAuth,
} from "../../middlewares/auth.js";
import healthStationInfoRouter from "./hsInfo/hsInfoRoute.js";

const healthStationRouter: Router = Router();

healthStationRouter.post("/", [adminAuth], errorHandler(hsController.register));
healthStationRouter.put("/:id", [adminAuth], errorHandler(hsController.update));
healthStationRouter.delete(
  "/:id",
  [adminAuth],
  errorHandler(hsController.delete)
);
healthStationRouter.get("/all", errorHandler(hsController.getAll));
healthStationRouter.get("/:id", errorHandler(hsController.getSingle));

healthStationRouter.use("/info", healthStationInfoRouter);

export default healthStationRouter;
