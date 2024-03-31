import express from "express";
import cors from 'cors';
import requestIp from "request-ip";
import { CORS_ORIGIN, HOST, PORT } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express() as express.Application; // Explicitly specify the type
const httpServer = createServer(app);

//prepare io
const io = new Server(httpServer, {
   pingTimeout: 60000,
   cors:{
      credentials:true,
      origin: CORS_ORIGIN,
   }
});
app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);

// global middlewares
app.use(
   cors({
     origin:
       process.env.CORS_ORIGIN === "*"
         ? "*" // This might give CORS error for some origins due to credentials set to true
         : process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production. 
     credentials: true,
   })
 );

 app.use(requestIp.mw());
 app.use(express.static("public")); // configure static file to save images locally


// Routes
import appRouter from "./routes/index.js";
app.use('/api', appRouter);
//testing route
app.get('/', (req, res) => {
   res.send("app working");
});

const startServer = () => {
   httpServer.listen(PORT || 8080, () => {
     console.log(`⚙️ Server is running http://${HOST}:${PORT}`);
   });
 };
 

 startServer();
// app.listen(PORT, () => console.log(`Server is running http://${HOST}:${PORT}`));
