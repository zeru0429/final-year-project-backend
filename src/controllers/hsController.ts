import { NextFunction, Request, Response } from "express";
import hsSchema from "../schema/hsSchema.js";
import { prisma } from "../config/prisma.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";

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

   },
   delete: async (req:Request,res:Response,next:NextFunction)=>{

   }

}
export default hsController;