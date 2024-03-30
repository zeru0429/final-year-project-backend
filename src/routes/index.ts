import { Router } from "express";
const appRouter = Router();

//importing all app routes
import adminRouter from "../api/admin/adminRoute.js";
import healthStationRouter from "../api/hs/hsRoute.js";
import usersRouter from "../api/user/userRoute.js";
import newsRouter from "../api/news/newsRoute.js";
import vaccineRouter from "../api/vaccine/vaccineRoute.js";
import childRouter from "../api/child/childRoute.js";
import certificationRouter from "../api/certification/certificationRoute.js";
import apointmentRouter from "../api/appointment/appointmantRoute.js";
import notificationRouter from "../api/notification/notificationRoute.js";


appRouter.use("/admin", adminRouter);
appRouter.use('/hs',healthStationRouter)
appRouter.use('/user',usersRouter);
appRouter.use('/child',childRouter);
appRouter.use('/news',newsRouter);
appRouter.use('/vaccine',vaccineRouter);
appRouter.use('/certification',certificationRouter);
appRouter.use('/appintment',apointmentRouter);
appRouter.use('/notification',notificationRouter);

export default appRouter;