import { NextFunction, Request, Response } from "express";
import newsSchema from "./newsSchema.js";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";

const newsController = {
  //create news
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
      res.status(200).json(theNewNews);
   },
   //update news
   updateNews: async (req:Request,res:Response,nex:NextFunction)=>{
    req.newsId=+req.params.id;
    newsSchema.updateNews.parse(req.body);
    const foundNews=await prisma.news.findFirstOrThrow({
      where:{
        id: +req.newsId
      }
    });
    if(!foundNews){
     return nex(new UnprocessableEntity("This News Doesn't Exist",404,ErrorCode.NEWS_NOT_FOUND,null));
    }
    const  updatedNews = await prisma.news.update({
      data: {
        titleAm: req.body.titleAm,
        titleOr: req.body.titleOr,
        descriptionAm: req.body.descriptionAm,
        descriptionOr: req.body.descriptionOr,
        
      },
      where:{
        id : foundNews.id
      }
    });
    res.status(200).json(updatedNews);

   },
   //delete news
   deleteNews:async (req:Request,res:Response,nex:NextFunction)=>{
    req.newsId=+req.params.id;
    const foundNews=await prisma.news.findFirstOrThrow({
      where:{
        id: +req.newsId
      }
    });
    if(!foundNews){
     return nex(new UnprocessableEntity("This News Doesn't Exist",404,ErrorCode.NEWS_NOT_FOUND,null));
    }
    const  deletedNews=await prisma.news.delete({where:{id:foundNews.id}});
    res.status(200).json(deletedNews);
   },
   //get public news
   getPublicNews:async (req:Request,res:Response,nex:NextFunction)=>{
    const news = await prisma.news.findMany({
      orderBy:{
        createdAt:"desc"
      },
      include:{
        images: true
      }
    });
    
    return res.status(200).json(news);

   },
   //get single news  detaile
   getSingleNews: async (req:Request,res:Response,nex:NextFunction)=>{
    req.newsId=+req.params.id;
    const foundNews=await prisma.news.findFirstOrThrow({
      where:{
        id: +req.newsId
      },
      include:{
        images: true
      }
    });
    if(!foundNews){
      return nex(new UnprocessableEntity("This News Doesn't Exist",404,ErrorCode.NEWS_NOT_FOUND,null));
     }

    res.status(200).json(foundNews);

   },
   getSingleNewsDetail: async (req:Request,res:Response,nex:NextFunction)=>{
    req.newsId=+req.params.id;
    const foundNews=await prisma.news.findFirstOrThrow({
      where:{
        id: +req.newsId
      },
      include:{
        images: true,
        writer:true,
        _count:true
      }

    });
    if(!foundNews){
      return nex(new UnprocessableEntity("This News Doesn't Exist",404,ErrorCode.NEWS_NOT_FOUND,null));
     }

    res.status(200).json(foundNews);

   }
}



export default newsController;