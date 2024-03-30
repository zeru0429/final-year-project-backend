import { NextFunction, Request, Response } from "express";
import childVaccineSchema from "./childVaccineSchema.js";
import { prisma } from "../../../config/prisma.js";
import { UnprocessableEntity } from "../../../exceptions/validation.js";
import { ErrorCode } from "../../../exceptions/root.js";

const vaccinateChildController = {
   vaccinate: async (req:Request,res:Response,next:NextFunction)=>{
      childVaccineSchema.register.parse(req.body);
      //check if the vaccine exist with this id
      const isVaccineExist = await prisma.vaccines.findFirst({where: {
         id: +req.body!.vaccineId
      }});
      if(!isVaccineExist){
         return next(new UnprocessableEntity('no vaccine found in this id',404,ErrorCode.VACCINE_NOT_FOUND,null));
      }
      //check if child exist 
      const isChildExist = await prisma.childrens.findFirst({where: {
         id: +req.body!.childId
      }});
      if(!isChildExist){
        return next(new UnprocessableEntity('no child found in this id',404,ErrorCode.CHILD_NOT_FOUND,null));
      }
      
     const childVaccine = await prisma.childrenVaccines.create({data:{
      createdDateTime: new Date(),
      isGiven: true,
      childId: +req.body!.childId,
      vaccineId: +req.body!.vaccineId
     }});
   
     res.status(200).json(childVaccine);
   },
   update: async (req:Request,res:Response,next:NextFunction)=>{
      req.cvId = +req.params.id;
      childVaccineSchema.update.parse(req.body);
      //check if the vaccine exist with this id
      const isChildVaccineExist = await prisma.childrenVaccines.findFirst({where: {
         id: +req.cvId
      }});
      if(!isChildVaccineExist){
         return next(new UnprocessableEntity('no vaccine found in this id',404,ErrorCode.CHILD_VACCINE_NOT_FOUND,null));
      }

      const isVaccineExist = await prisma.vaccines.findFirst({where: {
         id: +req.body!.vaccineId
      }});
      if(!isVaccineExist){
         return next(new UnprocessableEntity('no vaccine found in this id',404,ErrorCode.VACCINE_NOT_FOUND,null));
      }
      //check if child exist 
      const isChildExist = await prisma.childrens.findFirst({where: {
         id: +req.body!.childId
      }});
      if(!isChildExist){
        return next(new UnprocessableEntity('no child found in this id',404,ErrorCode.CHILD_NOT_FOUND,null));
      }
      
     const childVaccine = await prisma.childrenVaccines.update({data:{
      createdDateTime: new Date(),
      isGiven: req.body.isGiven,
      childId: +req.body!.childId,
      vaccineId: +req.body!.vaccineId
     },
   where:{
      id: +req.cvId
   }
});
   
     res.status(200).json(childVaccine);
      
   
   },
   delete: async (req:Request,res:Response,next:NextFunction)=>{
      req.cvId = +req.params.id;
      //check if the vaccine exist with this id
      const isChildVaccineExist = await prisma.childrenVaccines.findFirst({where: {
         id: +req.cvId
      }});
      if(!isChildVaccineExist){
         return next(new UnprocessableEntity('no child  vaccine found in this id',404,ErrorCode.CHILD_VACCINE_NOT_FOUND,null));
      }

      const childVaccine = await prisma.childrenVaccines.delete({where:{
         id: +req.cvId
      }});
      res.status(200).json({
         message: "sucessfully deleted",
         sucess: true
      });

     
   },
   getAllByChildId: async (req:Request,res:Response,next:NextFunction)=>{
      req.childId = +req.params.id;
      const childVaccine = await prisma.childrenVaccines.findMany({where:{
         childId: +req.childId
      }});
      res.status(200).json(childVaccine);
   },
   getAll: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const childVaccine = await prisma.childrenVaccines.findMany();
        res.status(200).json(childVaccine);
      } catch (error) {
        next(error);
      }
    },
   getAllByChildVaccineId: async (req:Request,res:Response,next:NextFunction)=>{
      req.cvId = +req.params.id;
      const childVaccine = await prisma.childrenVaccines.findMany({where:{
         id: +req.cvId
      }});
      res.status(200).json(childVaccine);
   },

  


}

export default vaccinateChildController;