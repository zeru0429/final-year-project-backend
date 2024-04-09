import { NextFunction, Request, Response } from "express";
import certificationSchema from "./certificationSchema.js";
import { prisma } from "../../config/prisma.js";
import { ErrorCode } from "../../exceptions/root.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";

const certificationController = {
   generateCertificate: async (req: Request, res: Response,next : NextFunction) => {
      certificationSchema.register.parse(req.body);
      //check if child exist
      const child = await prisma.childrens.findFirst({
         where: {
            id: +req.body.childId
         }
      });
      if(!child){
         return next(new UnprocessableEntity('This child not found',404,ErrorCode.CHILD_NOT_FOUND,null));
      }
      if(!child.isVaccineCompleted){
         return next(new UnprocessableEntity('This child not vaccine completed',404,ErrorCode.CHILD_NOT_VACCINE_COMPLETED,null));
      }
      //check if the child have certificate befor
      const certificate = await prisma.certifications.findFirst({
         where: {
            childId: +req.body.childId
         }
      }); 
      if(certificate){
         return next(new UnprocessableEntity('This child have certificate befor',404,ErrorCode.CHILD_HAVE_CERTIFICATE_BEFORE,null));
      }
      //create a new certificate
      const newCertificate = await prisma.certifications.create({
         data: {
            issuedDate: new Date(),
            name: req.body.name,
            childId: +req.body.childId,
            healthStationId: +req.body.healthStationId,
            registerdBy: req.user!.id,
            fileUrl: req.body.fileUrl,
         }
      });
      return res.status(200).json(newCertificate);
   },
   updateCertificate: async (req: Request, res: Response,next : NextFunction) => {
      req.certificateId = +req.params.id;
      certificationSchema.register.parse(req.body);
      //check certificate exist 
      const certificate = await prisma.certifications.findFirst({
         where:{
            id: +req.certificateId
         }
      });
      if(!certificate){
         return next(new UnprocessableEntity('This certificate not found',404,ErrorCode.CERTIFICATE_NOT_FOUND,null));
      }
      // start updating
      const updatedCertificate = await prisma.certifications.update({
         where:{
            id: +req.certificateId
         },
         data:{
            name: req.body.name,
            childId: +req.body.childId,  
         }
      });
      return res.status(200).json(updatedCertificate);
      
   },
   deleteCertificate: async (req: Request, res: Response,next : NextFunction) => {
      req.certificateId = +req.params.id;
      //check certificate exist 
      const certificate = await prisma.certifications.findFirst({
         where:{
            id: +req.certificateId
         }
      });
      if(!certificate){
         return next(new UnprocessableEntity('This certificate not found',404,ErrorCode.CERTIFICATE_NOT_FOUND,null));
      }
      // start deleting
      const deletedCertificate = await prisma.certifications.delete({
         where:{
            id: +req.certificateId
         }
      });
      return res.status(200).json({
         message: "sucessfully deleted",
         sucess: true
      });
      
   },
   getSingleCertificate: async (req: Request, res: Response,next : NextFunction) => {
      req.certificateId = +req.params.id;
      //check certificate exist 
      const certificate = await prisma.certifications.findFirst({
         include: {
            child: true,
         },
         where:{
            id: +req.certificateId
         }
      });
      return res.status(200).json(certificate);
   },
   getAllCertificate: async (req: Request, res: Response,next : NextFunction) => {
      //check certificate exist 
      const certificate = await prisma.certifications.findMany({
         skip: +req.query.skip!,
         take: +req.query.take!,
         include:{
            child:true,
         }
      });
      return res.status(200).json(certificate);
   },
   getCertificateByHs: async (req: Request, res: Response,next : NextFunction) => {
      req.hsId = +req.params.id;
      //check if the hs exist
      const hs = await prisma.healthStations.findFirst({
         where:{
            id: +req.hsId
         }
      });
      if(!hs){
         return next(new UnprocessableEntity('This health station not found',404,ErrorCode.HS_NOT_FOUND,null));
      }
      // get all certificates in that hs
      const certificates = await prisma.certifications.findMany({
         include:{
            child:true,
         },
         where:{
            healthStationId: +req.hsId
         }
      });
      return res.status(200).json(certificates);

   },
   getCertificateByChildId: async (req: Request, res: Response,next : NextFunction) => {
      req.childId = +req.params.id;
      //check if the child exist
      const child = await prisma.childrens.findFirst({
         where: {
            id: +req.childId
         },
      });
      if(!child){
         return next(new UnprocessableEntity('This child not found',404,ErrorCode.CHILD_NOT_FOUND,null));
      }
      // get all certificates in that child
      const certificates = await prisma.certifications.findFirst({
         include:{
            child: true,

         },
         where:{
            childId: +req.childId
         }
      });
      return res.status(200).json(certificates);
   },
   getCertificateByMotherId: async (req: Request, res: Response,next : NextFunction) => {
      req.mId = +req.params.id;
      //check if the mother exist
      const mother = await prisma.mothersProfile.findFirst({
         where: {
            id: +req.mId
         }
      });
      if(!mother){
         return next(new UnprocessableEntity('This mother not found',404,ErrorCode.MOTHER_NOT_FOUND,null));
      }
      // get all certificates in that mother
      const certificates = await prisma.certifications.findMany({
         include:{
            child: true,

         },
         where:{
           child:{
            motherId: +req.mId
           }
         }
      });
      return res.status(200).json(certificates);
   },
}
export default certificationController;