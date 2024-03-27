import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import {prisma} from '../config/prisma.js'
import { SECRET } from '../config/secrets.js'
import { BadRequest } from '../exceptions/badRequest.js'
import { ErrorCode } from '../exceptions/root.js'
import { STATUS_CODES } from 'http'
import { UnprocessableEntity } from '../exceptions/validation.js'
import authSchema from '../schema/authSchema.js'
import { generateOTP } from '../util/generateor.js'

const authController = {
   //register
   registerAdmin:async (req:Request,res:Response,next:NextFunction)=>{
      authSchema.registerAdmin.parse(req.body);
      //check if the email or phone used befor
      const isAdminExist= await prisma.admins.findFirst({where:{
         OR:[
            {email: req.body.email},
            {phone:req.body.phone}
         ]
       
      }});
      if(isAdminExist){
       return next(new UnprocessableEntity('Email or Phone has been registered before',403,ErrorCode.USER_ALLREDY_EXIST,null));
      }
      // create the admin
      const otp= generateOTP();
      const password = bcrypt.hashSync(req.body.password, 10);
      const newAdmin = await prisma.admins.create({
         data: {
            email: req.body.email,
            phone: req.body.phone,
            password: password,
            otp: otp,
            profile: {
               create: {
                  firstName: req.body.firstName,
                  middleName: req.body.middleName,
                  lastName: req.body.lastName,
                  imageUrl:req.body.imageUrl
               }
            }
         },
         include: {
            profile: true
         }
      });
      res.status(201).json(newAdmin);
   },
   //login user
   loginUser: async (req: Request, res: Response, next: NextFunction) => {
      authSchema.login.parse(req.body);
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
   //login admin
   loginAdmin: async (req: Request, res: Response, next: NextFunction) => {
      authSchema.login.parse(req.body);
      const admin = await prisma.admins.findFirst({ where: { email: req.body.email } });
      if (!admin) {
         return next(new UnprocessableEntity("No account found with this email", 403, ErrorCode.USER_NOT_FOUND, null));
      }
      const isMatch = bcrypt.compareSync(req.body.password, admin.password);
      if (!isMatch) {
         return next(new UnprocessableEntity('Incorrect password', 403, ErrorCode.INCORRECT_PASSWORD, null));
      }
      const adminProfiles = await prisma.adminProfiles.findFirst({ where: { adminId: admin.id } });
      // Create token
      const payload = {
         id: admin.id,
         role: admin.role,
         firstName: adminProfiles?.firstName
      };
      const token = jwt.sign(payload, SECRET!);
      return res.status(200).json({
         token,
         message: "Login successfully"
      });
   }

}

export default authController;
