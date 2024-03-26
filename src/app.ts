import express, { Express,Request,Response } from "express";
import { HOST, PORT } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";

const app: Express = express();
//middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware)

//routes
import appRouter from "./routes/index.js";
app.use('/api',appRouter);

app.get('/',(req:Request,res:Response)=>{
   res.send("app working");
});



app.listen(PORT,()=>console.log(`server is running http://${HOST}:${PORT}`))