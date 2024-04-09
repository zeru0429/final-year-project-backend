import { Router } from "express";
import { adminAuth, isAdmin } from "../../../middlewares/auth.js";
import errorHandler from "../../../config/errorHandler.js";
import vaccinateMotherController from "./motherVaccineController.js";


const motherVaccineRouter:Router = Router();

motherVaccineRouter.post('/',[adminAuth,isAdmin], errorHandler(vaccinateMotherController.vaccinate));
motherVaccineRouter.put('/:id',[adminAuth,isAdmin], errorHandler(vaccinateMotherController.update));
motherVaccineRouter.delete('/:id',[adminAuth,isAdmin], errorHandler(vaccinateMotherController.delete));

motherVaccineRouter.get('/',[adminAuth,isAdmin], errorHandler(vaccinateMotherController.getAll));
motherVaccineRouter.get('/:id',[adminAuth,isAdmin], errorHandler(vaccinateMotherController.getAllBymotherVaccineId));
motherVaccineRouter.get('/mother/:id',[adminAuth,isAdmin], errorHandler(vaccinateMotherController.getAllByMotherId));

export default motherVaccineRouter;