import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import certificationController from "./certificationController.js";

const certificationRouter:Router = Router();

certificationRouter.post('/',[userAuth], errorHandler(certificationController.generateCertificate));
certificationRouter.put('/:id',[userAuth], errorHandler(certificationController.updateCertificate));
certificationRouter.delete('/:id',[userAuth], errorHandler(certificationController.deleteCertificate));

// Get all children of a specific parent or
certificationRouter.get('/getall',[userAuth], errorHandler(certificationController.getAllCertificate));
certificationRouter.get('/:id',[userAuth], errorHandler(certificationController.getSingleCertificate));
certificationRouter.get('/hs/:id',[userAuth], errorHandler(certificationController.getCertificateByHs));
certificationRouter.get('/mother/:id',[userAuth], errorHandler(certificationController.getCertificateByMotherId));
certificationRouter.get('/child/:id',[userAuth], errorHandler(certificationController.getCertificateByChildId));

export default certificationRouter;