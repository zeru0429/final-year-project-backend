import { NextFunction, Request, Response } from "express";

const childController ={
   register: async (req:Request,res:Response,next:NextFunction): Promise<void> =>{
    

   },
   update: async (req:Request,res:Response,next:NextFunction)=>{},
   delete: async (req:Request,res:Response,next:NextFunction)=>{},
   getAll: async (req:Request,res:Response,next:NextFunction)=>{},
   getSingle: async (req:Request,res:Response,next:NextFunction)=>{},
   getByHs: async (req:Request,res:Response,next:NextFunction)=>{},
}

export default childController;