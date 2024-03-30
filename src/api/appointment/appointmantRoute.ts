import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import appointmantController from "./appointmantController.js";

const apointmentRouter:Router = Router();

apointmentRouter.post('/',[userAuth], errorHandler(appointmantController.newAppointments));
apointmentRouter.put('/:id',[userAuth], errorHandler(appointmantController.updateAppointments));
apointmentRouter.delete('/:id',[userAuth], errorHandler(appointmantController.deleteAppointments));

// Get all children of a specific parent or
apointmentRouter.get('/:id',[userAuth], errorHandler(appointmantController.getSingleAppointments));
apointmentRouter.get('/hs/:id',[userAuth], errorHandler(appointmantController.getAppointmentsByHs));
apointmentRouter.get('/mother/:id',[userAuth], errorHandler(appointmantController.getAppointmentsByMotherId));
apointmentRouter.get('/child/:id',[userAuth], errorHandler(appointmantController.getAppointmentsByChildId));

export default apointmentRouter;