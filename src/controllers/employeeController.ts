import { NextFunction, Request, Response } from "express";
import userSchema from "../schema/userSchema.js";
import { prisma } from "../config/prisma.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";

const employeeController ={
   register: async (req:Request,res:Response,next:NextFunction): Promise<void> =>{
      userSchema.registerEmployee.parse(req.body);
      //check if the employye exist before
      const isEmployeeExist = await prisma.users.findFirst({where:{
         OR:[
            {email: req.body.email},
            {phone: req.body.phone}
         ]
      }});
      if(isEmployeeExist){
         return next(new UnprocessableEntity('Email or Phone has been registered before',403,ErrorCode.USER_ALLREDY_EXIST,null));
      }
      //create the employee
      const  newUser=await prisma.users.create({
         data:{
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            role: req.body.role,
            healthStationId: req.body.healthStationId,
            profile:{
               create:{
                  firstName: req.body.firstName,
                  middleName: req.body.middleName,
                  lastName: req.body.lastName,
                  imageUrl: req.body.imageUrl,
                  sex:req.body.sex
               }
            },
            proProfile:{
               create:{
                  healthStationId:req.body.healthStationId,
                  position: req.body.position,
                  title: req.body.title
               }
            }
      },
      include:{
         profile: true,
         proProfile: true
      }
   
   });
   res.status(201).json(newUser);
   },
   
}

export default employeeController;