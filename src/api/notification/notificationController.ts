import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import notificationSchema from "./notificationSchema.js";

const notificationController ={
   //register notification
   register: async (req:Request,res:Response,next:NextFunction) =>{
      notificationSchema.register.parse(req.body);
      const newNotification = await prisma.notification.create({data: req.body});
      res.status(200).json(newNotification);

      
   },
   update: async (req:Request,res:Response,next:NextFunction) =>{ 
      notificationSchema.update.parse(req.body);
      req.notificationId = +req.params.id;
      const updatedNotification = await prisma.notification.update({where: {id: +req.notificationId}, data: req.body});
      res.status(200).json(updatedNotification);

   },
   seenupdate: async (req:Request,res:Response,next:NextFunction) =>{ 
      console.log("======================")
      // notificationSchema.update.parse(req.body);
      req.notificationId = +req.params.id;
      const updatedNotification = await prisma.notification.update({where: {id: +req.notificationId}, data:{
         seen: true,
      }});
      res.status(200).json({success: true,message: "update successfully",data:updatedNotification});

   },
   getSingle: async (req:Request,res:Response,next:NextFunction) =>{
      req.notificationId = +req.params.id;
      const isNotification = await prisma.notification.findFirst({where: {id: +req.notificationId}});
      res.status(200).json(isNotification);
   },
   getAll: async (req:Request,res:Response,next:NextFunction) =>{
      const allNotifications = await prisma.notification.findMany();
      res.status(200).json(allNotifications);
   },
   getMy: async (req:Request,res:Response,next:NextFunction) =>{
      // console.log("sucessfully fetch the data" + req.user!.id);
      const notification = await prisma.notification.findMany({
         where: {
            userId: +req.user!.id
         }
      });
      res.status(200).json({
         data: notification,
         success: true,
         message: "sucessfully fetch the data"
      })
   },
   delete: async (req:Request,res:Response,next:NextFunction) =>{
      req.notificationId = +req.params.id;
      const deletedNotification = await prisma.notification.delete({where: {id: +req.notificationId}});
      res.status(200).json(deletedNotification);
   }

}

export default notificationController;