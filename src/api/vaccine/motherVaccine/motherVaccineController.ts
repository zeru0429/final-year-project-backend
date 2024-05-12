import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../config/prisma.js";
import { UnprocessableEntity } from "../../../exceptions/validation.js";
import { ErrorCode } from "../../../exceptions/root.js";
import motherVaccineSchema from "../childVaccine/childVaccineSchema.js";

const vaccinateMotherController = {
   vaccinate: async (req:Request,res:Response,next:NextFunction)=>{
      motherVaccineSchema.register.parse(req.body);
      //check if the vaccine exist with this id
      const isVaccineExist = await prisma.vaccines.findFirst({where: {
         id: +req.body!.vaccineId
      }});
      if(!isVaccineExist){
         return res.status(403).json({
            success: false,
            message: "no vaccine found in this id",
          });
        }
      //check if child exist 
      const isMotherExist = await prisma.mothersProfile.findFirst({where: {
         id: +req.body!.motherId
      }});
      if(!isMotherExist){
         return res.status(403).json({
            success: false,
            message: "no mother found in this id",
          });
      }
    
      
     const motherVaccine = await prisma.motherVaccines.create({data:{
      createdDateTime: new Date(),
      isGiven: true,
      vaccineId: +req.body!.vaccineId,
      motherId: +isMotherExist.userId,
      healthStationId: +req.body.healthStationId,
     }});
   
    return res.status(200).json(motherVaccine);
   },
   update: async (req:Request,res:Response,next:NextFunction)=>{
      req.mvId = +req.params.id;
      motherVaccineSchema.update.parse(req.body);
      //check if the vaccine exist with this id
      const isMotherVaccineExist = await prisma.motherVaccines.findFirst({where: {
         id: +req.mvId
      }});
      if(!isMotherVaccineExist){
         return res.status(403).json({
            success: false,
            message: 'no mother vaccine found in this id',
          });
               }

      const isVaccineExist = await prisma.vaccines.findFirst({where: {
         id: +req.body!.vaccineId
      }});
      if(!isVaccineExist){
         return res.status(403).json({
            success: false,
            message: "no vaccine found in this id",
          });
             }
      //check if child exist 
      const isMotherExist = await prisma.childrens.findFirst({where: {
         id: +req.body!.childId
      }});
      if(!isMotherExist){
         return res.status(403).json({
            success: false,
            message: "no mother  found in this id",
          });
          }
      
     const motherVaccine = await prisma.motherVaccines.update({data:{
      motherId: +req.body!.motherId,
      createdDateTime: new Date(),
      isGiven: req.body.isGiven,
      vaccineId: +req.body!.vaccineId
     },
   where:{
      id: +req.mvId
   }
});
   
    return res.status(200).json(motherVaccine);
      
   
   },
   delete: async (req:Request,res:Response,next:NextFunction)=>{
      req.mvId = +req.params.id;
      //check if the vaccine exist with this id
      const isMotherVaccineExist = await prisma.motherVaccines.findFirst({where: {
         id: +req.mvId
      }});
      if(!isMotherVaccineExist){
         return res.status(403).json({
            success: false,
            message: 'no child  vaccine found in this id',
          });
            }

      const motherVaccine = await prisma.motherVaccines.delete({where:{
         id: +req.mvId
      }});
     return res.status(200).json({
         message: "sucessfully deleted",
         sucess: true
      });

     
   },
   getAllByMotherId: async (req:Request,res:Response,next:NextFunction)=>{
      req.mId = +req.params.id;
      const motherVaccine = await prisma.motherVaccines.findMany({where:{
         motherId: +req.mId
      }});
     return res.status(200).json(motherVaccine);
   },
   getAll: async (req: Request, res: Response, next: NextFunction) => {
        const motherVaccine = await prisma.motherVaccines.findMany();
       return res.status(200).json(motherVaccine);
    },
   getAllBymotherVaccineId: async (req:Request,res:Response,next:NextFunction)=>{
      req.cvId = +req.params.id;
      const motherVaccine = await prisma.motherVaccines.findMany({where:{
         id: +req.cvId
      }});
     return res.status(200).json(motherVaccine);
   },

}

export default vaccinateMotherController;