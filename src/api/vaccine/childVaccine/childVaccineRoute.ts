import { Router } from "express";
import {
  adminAuth,
  isAdmin,
  isHealthProfetional,
  userAuth,
} from "../../../middlewares/auth.js";
import errorHandler from "../../../config/errorHandler.js";
import ChildVaccineController from "./childVaccineController.js";

const childVaccineRouter: Router = Router();

childVaccineRouter.get(
  "/child/:id",
  [userAuth],
  errorHandler(ChildVaccineController.getAllByChildId)
);

childVaccineRouter.post(
  "/",
  [userAuth, isHealthProfetional],
  errorHandler(ChildVaccineController.vaccinate)
);
childVaccineRouter.put(
  "/:id",
  [userAuth, isHealthProfetional],
  errorHandler(ChildVaccineController.update)
);
childVaccineRouter.delete(
  "/:id",
  [userAuth, isHealthProfetional],
  errorHandler(ChildVaccineController.delete)
);

childVaccineRouter.get("/all", errorHandler(ChildVaccineController.getAll));
childVaccineRouter.get(
  "/:id",
  [userAuth],
  errorHandler(ChildVaccineController.getAllByChildVaccineId)
);

childVaccineRouter.get(
  "/mother/:id",
  [userAuth],
  errorHandler(ChildVaccineController.getChildrenVaccByMotherId)
);

export default childVaccineRouter;
