import { Router } from "express";
const appRouter = Router();

//importing all app routes
import adminRouter from "../api/admin/adminRoute.js";
import healthStationRouter from "../api/hs/hsRoute.js";
import employeeRouter from "../api/user/employee/employeeRoute.js";
import motherRouter from "../api/user/mother/motherRoute.js";
import newsRouter from "../api/news/newsRoute.js";
import vaccineRouter from "../api/vaccine/vaccineRoute.js";


appRouter.use("/admin", adminRouter);
appRouter.use('/hs',healthStationRouter)
appRouter.use('/employee',employeeRouter)
appRouter.use('/mother',motherRouter)
appRouter.use('/news',newsRouter);
appRouter.use('/vaccine',vaccineRouter);

export default appRouter;