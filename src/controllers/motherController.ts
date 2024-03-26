import { NextFunction, Request, Response } from "express";
import userSchema from "../schema/userSchema.js";
import { prisma } from "../config/prisma.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";

const motherController ={
   register: async (req:Request,res:Response,next:NextFunction): Promise<void> =>{
      userSchema.registerMother.parse(req.body);
      //check if the employye exist before
      const isMotherExist = await prisma.users.findFirst({where:{
         OR:[
            {email: req.body.email},
            {phone: req.body.phone}
         ]
      }});
      if(isMotherExist){
         return next(new UnprocessableEntity('Email or Phone has been registered before',403,ErrorCode.USER_ALLREDY_EXIST,null));
      }
      //create the employee
      const newMother=await prisma.users.create({
         data:{
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            profile:{
               create:{
                  firstName: req.body.firstName,
                  middleName: req.body.middleName,
                  lastName: req.body.lastName,
                  imageUrl: req.body.imageUrl,
                  sex:req.body.sex
               }
            },
            motherProfile:{
               create:{
                  birthdate: new Date(req.body.birthdate),
                  bloodType: req.body.bloodType,
                  RH: req.body.RH,  
               }
            }
      },
      include:{
         profile: true,
         motherProfile:true
      }
   
   });
   res.status(201).json(newMother);
   },
   
}

export default motherController;