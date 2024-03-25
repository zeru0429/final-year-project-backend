import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import {prisma} from '../config/prisma.js'
import { SECRET } from '../config/secrets.js'
import { BadRequest } from '../exceptions/badRequest.js'
import { ErrorCode } from '../exceptions/root.js'
import { STATUS_CODES } from 'http'
import { UnprocessableEntity } from '../exceptions/validation.js'
import authSchema from '../schema/auth.js'

const authController = {
   signup:async (req:Request,res:Response,next:NextFunction)=>{
     
         authSchema.signup.parse(req.body);
         const {email,password,firstName,lastName,middleName} = req.body;
         const User = await prisma.users.findFirst({
            where:{
               email:email
            }
         });
         if(User){
            next(new BadRequest("User already exist", 400, ErrorCode.USER_ALLREDY_EXIST, null))
         }

         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hashSync(password, salt);

         const newUser = await prisma.users.create({
            data:{
               email,
               password:hashedPassword,
               firstName,
               lastName,
               middleName
            }
         });
         return res.status(201).send({message:"User created successfully",data:newUser})
      

   },
   login: async (req:Request,res:Response,next:NextFunction)=>{
      try {
         const {email,password} = req.body;

         const User = await prisma.users.findFirst({
            where:{
               email:email
            }
         });
         if(!User){
            next( new BadRequest("User does not exist", 400, ErrorCode.USER_NOT_FOUND, null)) 
         }

         const isMatch = await bcrypt.compareSync(password, User.password);
         if(!isMatch){
            next( new BadRequest("Incorrect password", 400, ErrorCode.INCORRECT_PASSWORD, null))
         }
         const token = jwt.sign({email:User.Id}, SECRET!, { expiresIn: '1h' });
         return res.status(200).send({message:"Login successful",data:User,token})
         
      } catch (error) {
         next(new UnprocessableEntity('server error',500,ErrorCode.USER_NOT_FOUND,null));
      }

   },

}

export default authController;
