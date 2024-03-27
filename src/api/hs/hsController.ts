import { NextFunction, Request, Response } from "express";
import hsSchema from "./hsSchema.js";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";

const hsController = {
   register: async (req:Request,res:Response,next:NextFunction): Promise<void> =>{
      hsSchema.register.parse(req.body);
      //check if the hs exist before
      const hs= await prisma.healthStations.findFirst({
         where:{
            email: req.body.email
         }
      });
      if(hs){
         return next(new UnprocessableEntity('health station is all redy  registered',403,ErrorCode.USER_ALLREDY_EXIST,null));
      }
      // create  a new health station
      req.body.registeredBy= req.admin!.id;
      const newHs=await prisma.healthStations.create({data:req.body});
      res.status(201).json(newHs);

   },
   update: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsId=+req.params.id;
      hsSchema.register.parse(req.body);
      //check if the hs exist before
      const hs= await prisma.healthStations.findFirst({
         where:{
            id: +req.hsId
         }
      });
      if(!hs){
         return next(new UnprocessableEntity('health station is is not found',403,ErrorCode.HS_NOT_FOUND,null));
      }
      const updatedHs=await prisma.healthStations.update({data:req.body,where:{id: +req.hsId}});
      res.status(201).json(updatedHs);


   },
   delete: async (req:Request,res:Response,next:NextFunction)=>{
      
   //check if the hs exist before
   const hs= await prisma.healthStations.findFirst({
      where:{
         id: +req.hsId
      }
   });
   if(!hs){
      return next(new UnprocessableEntity('health station is is not found',403,ErrorCode.HS_NOT_FOUND,null));
   }

   //delete the hsInfo
   const deleteHs = await prisma.healthStations.delete({
      where: {
         id: +req.hsId
      },
   });
   res.status(200).json(deleteHs);

   },
   getAll: async (req:Request,res:Response,next:NextFunction)=>{
      //get hs
      const hs = await prisma.healthStations.findMany();
      res.status(200).json(hs);
      
   },
   getSingle: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsId=+req.params.id;
      //get hs
      const hs = await prisma.healthStations.findFirstOrThrow({
         where:{
            id: +req.hsId
         }
      });
      res.status(200).json(hs);
   },

}
export default hsController;