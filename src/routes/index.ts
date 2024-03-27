import { Router } from "express";
const appRouter = Router();

//importing all app routes
import authRouter from "./adminRoute.js";
import healthStationRouter from "./healthStationRoute.js";
import employeeRouter from "./employee.js";
import motherRouter from "./motherRoute.js";
import newsRouter from "./newsRoute.js";

appRouter.use("/auth", authRouter);
appRouter.use('/hs',healthStationRouter)
appRouter.use('/employee',employeeRouter)
appRouter.use('/mother',motherRouter)
appRouter.use('/news',newsRouter);

export default appRouter;