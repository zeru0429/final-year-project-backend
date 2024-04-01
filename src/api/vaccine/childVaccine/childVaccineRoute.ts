import { Router } from "express";
import { adminAuth, isAdmin } from "../../../middlewares/auth.js";
import errorHandler from "../../../config/errorHandler.js";
import ChildVaccineController from "./childVaccineController.js";

const childVaccineRouter:Router = Router();

childVaccineRouter.post('/',[adminAuth,isAdmin], errorHandler(ChildVaccineController.vaccinate));
childVaccineRouter.put('/:id',[adminAuth,isAdmin], errorHandler(ChildVaccineController.update));
childVaccineRouter.delete('/:id',[adminAuth,isAdmin], errorHandler(ChildVaccineController.delete));

childVaccineRouter.get('/all', errorHandler(ChildVaccineController.getAll));
childVaccineRouter.get('/:id',[adminAuth,isAdmin], errorHandler(ChildVaccineController.getAllByChildVaccineId));
childVaccineRouter.get('/chid/:id',[adminAuth,isAdmin], errorHandler(ChildVaccineController.getAllByChildId));

export default childVaccineRouter;