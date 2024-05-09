import { Router } from "express";
import newsController from "./newsController.js";
import { adminAuth, isAdmin, isSuperAdmin } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";

const newsRouter = Router();
newsRouter.get("/detail/:id", errorHandler(newsController.getSingleNewsDetail));
newsRouter.put(
  "/:id",
  [adminAuth, isSuperAdmin],
  errorHandler(newsController.updateNews)
);
newsRouter.delete(
  "/:id",
  [adminAuth, isSuperAdmin],
  errorHandler(newsController.deleteNews)
);

newsRouter.get("/:id", errorHandler(newsController.getSingleNews));

newsRouter.get("/", errorHandler(newsController.getPublicNewsPagenation));
newsRouter.post(
  "/",
  [adminAuth, isSuperAdmin],
  errorHandler(newsController.createNews)
);

export default newsRouter;
