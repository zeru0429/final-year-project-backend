
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { SECRET } from "../config/secrets.js";
import { prisma } from "../config/prisma.js";
import { Unauthorized } from "../exceptions/unauthorized.js";
import { any } from "zod";
import { NotFound } from "../exceptions/notFound.js";

const auth = async (req:Request,res:Response,next:NextFunction)=>{
   const token = req.headers.authorization;
   if(!token){
     return next(new UnprocessableEntity('Token not found',404,ErrorCode.TOKEN_NOT_FOUND,null))
   }
   try {
      const payload = await jwt.verify(token, SECRET!) as any;
      const user =  await prisma.users.findUnique({
         where:{
            id:(payload).id
         }
      })
      if(!user){
         return next(new NotFound('user not found',404,ErrorCode.USER_NOT_FOUND,null))
      }
      req.user = (payload);
      next();
   } catch (error) {
      return next(new UnprocessableEntity('invalide token',404,ErrorCode.TOKEN_NOT_FOUND,null))
   }

}
const isAdmin = async (req:Request,res:Response,next:NextFunction)=>{
   const user = req.user as any;
   if(user.role !== 'admin'){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}


export {auth,isAdmin};