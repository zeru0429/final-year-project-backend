import { Router } from "express";
import newsController from "../controllers/newsController.js";
import { adminAuth, isAdmin, isSuperAdmin } from "../middlewares/auth.js";
import errorHandler from "../config/errorHandler.js";

const newsRouter = Router();
newsRouter.post('/',[adminAuth,isSuperAdmin],errorHandler(newsController.createNews));
newsRouter.put("/:id",[adminAuth,isSuperAdmin],errorHandler(newsController.updateNews));
newsRouter.delete("/:id",[adminAuth,isSuperAdmin],errorHandler(newsController.deleteNews));

newsRouter.get("/",errorHandler(newsController.getPublicNews));
newsRouter.get("/:id",errorHandler(newsController.getSingleNews));

export default newsRouter;