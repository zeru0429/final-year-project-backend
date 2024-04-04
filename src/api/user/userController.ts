import { NextFunction, Request, Response } from "express";
import jwt  from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import userSchema from "./userSchema.js";
import bcrypt from 'bcrypt'
import { SECRET } from "../../config/secrets.js";
const usersController ={

   updatedEmailAndPhone: async  (req:Request,res:Response,next:NextFunction)=>{
      req.userId = + req.params.id;
      userSchema.updateEmailAndPhone.parse(req.body);
      //check if  user exist
      const isUserExist = await prisma.users.findFirst({
         where: {
            AND: [{id: +req.userId},{role: req.body.role},{healthStationId: req.body.healthStationId}]
         }
      });
      if(!isUserExist){
         return next(new UnprocessableEntity('no user found in this id',404,ErrorCode.USER_NOT_FOUND,null));
      }
      //check if the email and phone used befor
      const isEmailAndPhoneUsed = await prisma.users.findFirst({where:{
         OR:[
            {email: req.body.email},
            {phone: req.body.phone}
         ]
      }});
      if(isEmailAndPhoneUsed){
         return next(new UnprocessableEntity('Email or Phone has been registered before',403,ErrorCode.USER_ALREADY_EXIST,null));
      }
      //start updateing
      const updatedUser = await prisma.users.update({where: {id: +req.userId},data:{email: req.body.email,phone: req.body.phone}});
      res.status(200).json(updatedUser);

      
   },
   changePassword: async  (req:Request,res:Response,next:NextFunction)=>{
      //check if user exist
      const isUser = await prisma.users.findFirst({where: {id: req.user!.id}});
      if(!isUser){
       return  next(new UnprocessableEntity('user not found',404,ErrorCode.USER_NOT_FOUND,null));
      }
      //check if the old passwod is correct
      const isMatch = await bcrypt.compareSync(req.body.oldPassword,isUser!.password);
      if(!isMatch){
        return next(new UnprocessableEntity('incorrect old passwod',403,ErrorCode.INCORRECT_OLD_PASSWORD,null));
      }
      req.body.newPasswod = bcrypt.hashSync(req.body.newPasswod,10);
      //update password
      const updatedPassword = await prisma.users.update({
         where: {id: req.user!.id},
         data: {password:req.body.newPasswod }
      });
      res.status(200).json(updatedPassword);
   },
  
   delete: async (req:Request,res:Response,next:NextFunction)=>{
      req.userId =+req.params.id;
      // check if user exist usind id and role
      const isUserExist = await prisma.users.findFirst({
         where: {
            AND: [{id: +req.userId},{role: req.body.role}]
         }
      });
      if(!isUserExist){
         return next(new UnprocessableEntity('no user found in this id',404,ErrorCode.USER_NOT_FOUND,null));
      }
      //start deleting
      const isUserDeleted = await prisma.users.delete({where: {
         id: +req.userId,
      }});
      res.status(200).json({
         message: "sucessfully deleted",
         sucess: true
      });

   },
   getAll: async (req:Request,res:Response,next:NextFunction)=>{
      const allUsers = await prisma.users.findMany();
      res.status(200).json(allUsers);

   },
   getSingle: async (req:Request,res:Response,next:NextFunction)=>{
      req.userId = +req.params.id;
      const isUser = await prisma.users.findFirst({where: {id: +req.userId}});
      res.status(200).json(isUser);

   },
   getByHs: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsId = +req.params.hsId;
      //check if hs exist
      const isHsExist = await prisma.healthStations.findFirst({where: {id: +req.hsId}});
      if(!isHsExist){
         return next(new UnprocessableEntity('no health Station found found in this id',404,ErrorCode.HS_NOT_FOUND,null));
      }
      // get all users in that hs
      const allUsersInHs = await prisma.users.findMany({where: {healthStationId: +req.hsId}});
      res.status(200).json(allUsersInHs);
   },
   //login user
   loginUser: async (req: Request, res: Response, next: NextFunction) => {
      userSchema.login.parse(req.body);
      const user = await prisma.users.findFirst({ where: { email: req.body.email } });
      if (!user) {
         return next(new UnprocessableEntity("No account found with this email", 403, ErrorCode.USER_NOT_FOUND, null));
      }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
         return next(new UnprocessableEntity('Incorrect password', 403, ErrorCode.INCORRECT_PASSWORD, null));
      }
      const userProfile = await prisma.userProfiles.findFirst({ where: { userId: user.id } });
      // Create token
      const payload = {
         id: user.id,
         role: user.role,
         firstName: userProfile?.firstName
      };
      const token = jwt.sign(payload, SECRET!);
      return res.status(200).json({
         token,
         message: "Login successfully"
      });
   },
   myInfo: async (req: Request, res: Response, next: NextFunction) => {
      const user = await prisma.users.findFirst({ 
         where: 
         { id: +req.user!.id },
         include:{
            _count:true,
            profile: true,
            motherProfile: true,
            proProfile: true, 
            adminOfChats: true,
            appointment:true,
            certifications:true,
            child: true,
            childVaccine: true,
            healthStation: true,
            motherVaccine: true,
            notification: true,
            participantInChats: true,
            sentMessages: true,
            report: true
          }
          });
          res.status(200).json(user);
   }
}

export default usersController;