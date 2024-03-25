import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpExecption } from "../exceptions/root.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { InternalException } from "../exceptions/internalException.js";

const errorHandler =(method:Function)=> {
   return async (req:Request,res:Response,next:NextFunction)=>{
      try {
        await method(req,res,next);
      } catch (error) {
         let exception:HttpExecption;
         if(error instanceof HttpExecption){
            exception = error;
         }else{
            exception = new InternalException('something is wrong',500,ErrorCode.INTERNAL_EXCEPTION,null);
         }
         next(exception);
      }
   }

}

export default errorHandler;