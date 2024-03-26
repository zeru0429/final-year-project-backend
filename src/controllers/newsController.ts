import { NextFunction, Request, Response } from "express";
import newsSchema from "../schema/newsSchema.js";
import { prisma } from "../config/prisma.js";

const newsController = {
   createNews: async (req:Request,res:Response,nex:NextFunction)=>{
      newsSchema.createNews.parse(req.body);
      const theNewNews = await prisma.news.create({
         data: {
           titleAm: req.body.titleAm,
           titleOr: req.body.titleOr,
           descriptionAm: req.body.descriptionAm,
           descriptionOr: req.body.descriptionOr,
           writerId: req.admin!.id,
           images: {
             create: req.body.images.map((imageUrl: string) => ({ imageUrl }))
           }
         },
         include: {
           images: true
         }
       });
       
      

   },
   updateNews: async (req:Request,res:Response,nex:NextFunction)=>{

   },
   deleteNews:async (req:Request,res:Response,nex:NextFunction)=>{

   },

}


export default newsController;