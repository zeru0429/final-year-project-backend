import { NextFunction, Request, Response } from "express";
import newsSchema from "../schema/newsSchema.js";
import { prisma } from "../config/prisma.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import vaccineSchema from "../schema/vaccineSchema.js";

const vaccineController = {
   register: async (req:Request,res:Response,nex:NextFunction)=>{
      vaccineSchema.register.parse(req.body);
      //check if the vaccine exist before
      const vaccine = await prisma.vaccines.findFirst({
         where:{
            OR:[
               {name: req.body.name},
               {category: req.body.name}
            ]
         }
      }) ;
      if(vaccine){
         return nex(new UnprocessableEntity('the vaccine is already registerd',403,ErrorCode.VACCINE_ALLREDY_EXIST,null));
      }
      req.body.registeredBy= req.admin?.id;
      const newVaccine = await prisma.vaccines.create({data: req.body});
      res.status(200).json(newVaccine);


   },
   update: async (req:Request,res:Response,nex:NextFunction)=>{
      req.vaccineId=+req.params.id;
      //check if the vaccine exist with this id
      const  isVaccineExist = await  prisma.vaccines.findFirst({where:{
         id: +req.vaccineId
      }});
      if(!isVaccineExist) {
         return nex(new UnprocessableEntity("This Vaccine does not exist",403,ErrorCode.VACCINE_NOT_FOUND,null));
      }
      const updatedVaccine = await prisma.vaccines.update({
         where:{id:+ req.vaccineId},
         data:req.body
      });
      res.status(200).json(updatedVaccine);
   },
   delete: async (req:Request,res:Response,nex:NextFunction)=>{
      req.vaccineId=+req.params.id;
      //check if the vaccine exist with this id
      const  isVaccineExist = await  prisma.vaccines.findFirst({where:{
         id: +req.vaccineId
      }});
      if(!isVaccineExist) {
         return nex(new UnprocessableEntity("This Vaccine does not exist",403,ErrorCode.VACCINE_NOT_FOUND,null));
      }
      //start delating
      const delatedVaccine = await prisma.vaccines.delete({where:{id : +req.vaccineId}});
      res.status(200).json({ message:  "delated sucessfully",success: true});
   },
   getAll: async (req:Request,res:Response,nex:NextFunction)=>{
      const  vaccines =await prisma.vaccines.findMany();
      res.status(200).json(vaccines);
   },
   getSingle: async (req:Request,res:Response,nex:NextFunction)=>{
      req.vaccineId=+req.params.id;
      const singleVaccine =await prisma.vaccines.findFirstOrThrow({
         where:{
            id: +req.vaccineId
         }
      });
      res.status(200).json(singleVaccine);
   },
   


}

export default vaccineController;