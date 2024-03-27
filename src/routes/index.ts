import { Router } from "express";
const appRouter = Router();

//importing all app routes
import adminRouter from "./adminRoute.js";
import healthStationRouter from "./healthStationRoute.js";
import employeeRouter from "./employee.js";
import motherRouter from "./motherRoute.js";
import newsRouter from "./newsRoute.js";
import vaccineRouter from "./vaccineRoute.js";


appRouter.use("/admin", adminRouter);
appRouter.use('/hs',healthStationRouter)
appRouter.use('/employee',employeeRouter)
appRouter.use('/mother',motherRouter)
appRouter.use('/news',newsRouter);
appRouter.use('/vaccine',vaccineRouter);

export default appRouter;