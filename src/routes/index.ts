import { Router } from "express";
const appRouter = Router();

//importing all app routes
import authRouter from "./authRoute.js";

appRouter.use("/auth", authRouter);

export default appRouter;