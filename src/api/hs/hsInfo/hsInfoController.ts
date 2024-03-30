import { NextFunction, Request, Response } from "express";
import hsInfoSchema from "./hsInfoSchema.js";
import { prisma } from "../../../config/prisma.js";
import { UnprocessableEntity } from "../../../exceptions/validation.js";
import { ErrorCode } from "../../../exceptions/root.js";

const hsInfoController = {
   register: async (req:Request,res:Response,next:NextFunction)=>{
      hsInfoSchema.register.parse(req.body);
      const newHsInfo =  await prisma.healthStationInfos.create({data: req.body});
      res.status(200).json(newHsInfo);
   },
   update: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsInfoId=+req.params.id;
      hsInfoSchema.register.parse(req.body);
      //get hsInfo first
      const isHsInfoExist = await prisma.healthStationInfos.findFirst({
         where: {
            id: +req.hsInfoId
         }
      });
      if(!isHsInfoExist){
         return next(new UnprocessableEntity("This health station information does not exist",403,ErrorCode.VACCINE_NOT_FOUND,null));
      }
      // update the hsInfo
      const updatedHsInfo = await prisma.healthStationInfos.update({
         where: {
            id: +req.hsInfoId
         },
         data: req.body,
      });
      res.status(200).json(updatedHsInfo);

   },
   delete: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsInfoId=+req.params.id;
       //get hsInfo first
       const isHsInfoExist = await prisma.healthStationInfos.findFirst({
         where: {
            id: +req.hsInfoId
         }
      });
      if(!isHsInfoExist){
         return next(new UnprocessableEntity("This health station information does not exist",403,ErrorCode.VACCINE_NOT_FOUND,null));
      }
      //delete the hsInfo
      const deleteHsInfo = await prisma.healthStationInfos.delete({
         where: {
            id: +req.hsInfoId
         },
      });
      res.status(200).json(deleteHsInfo);

   },
   getAll: async (req:Request,res:Response,next:NextFunction)=>{
      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjj");
   // const hsInfo = await prisma.healthStationInfos.findMany();
   // res.status(200).json(hsInfo);
   },
   getSingle: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsInfoId=+req.params.id;
      const hsInfo = await prisma.healthStationInfos.findMany({
         where:{
            id: +req.hsInfoId
         }
      });
      res.status(200).json(hsInfo);

   },
   getByHs: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsId=+req.params.hsId;
      const hsInfo = await prisma.healthStationInfos.findMany({
         where:{
            healthStationId: +req.hsId,
         }
      });
      res.status(200).json(hsInfo);

   },
   getAllDetaile: async (req:Request,res:Response,next:NextFunction)=>{
      //get hs
      const hs = await prisma.healthStationInfos.findMany({
         include: {
            healthStation: true
         }
      });
      res.status(200).json(hs);
   },
   getSingleDetaile: async (req:Request,res:Response,next:NextFunction)=>{
      req.hsId=+req.params.hsId;
      //get hs
      const hs = await prisma.healthStationInfos.findMany({
         include: {
            healthStation: true
         },
         where:{
            healthStation:{
               id: +req.hsId,
            }
         }
      });
      res.status(200).json(hs);
   },

}

export default hsInfoController;