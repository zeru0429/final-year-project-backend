import { Router } from "express";
import {
  adminAuth,
  isAdmin,
  isHealthProfetional,
  userAuth,
} from "../../../middlewares/auth.js";
import errorHandler from "../../../config/errorHandler.js";
import vaccinateMotherController from "./motherVaccineController.js";

const motherVaccineRouter: Router = Router();

motherVaccineRouter.get(
  "/mother/:id",
  errorHandler(vaccinateMotherController.getAllByMotherId)
);

motherVaccineRouter.post(
  "/",
  //   [userAuth, isHealthProfetional],
  errorHandler(vaccinateMotherController.vaccinate)
);
motherVaccineRouter.put(
  "/:id",
  [userAuth, isHealthProfetional],
  errorHandler(vaccinateMotherController.update)
);
motherVaccineRouter.delete(
  "/:id",
  [userAuth, isHealthProfetional],
  errorHandler(vaccinateMotherController.delete)
);

motherVaccineRouter.get("/all", errorHandler(vaccinateMotherController.getAll));
motherVaccineRouter.get(
  "/:id",
  errorHandler(vaccinateMotherController.getAllBymotherVaccineId)
);

export default motherVaccineRouter;
