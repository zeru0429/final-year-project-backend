import { NextFunction, Request, Response } from "express"
import { HttpExecption } from "../exceptions/root.js"

export const errorMiddleware = (err: HttpExecption, req: Request, res: Response, next: NextFunction) => {
   return res.status(err.statusCode).json({
         message: err.message,
         errorCode: err.errorCode,
         errors: err.error      
   })
}