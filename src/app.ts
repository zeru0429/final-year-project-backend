import express from "express";
import cors from 'cors';
import jwt from "jsonwebtoken";
import requestIp from "request-ip";
import { CORS_ORIGIN, HOST, PORT, SECRET } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express() as express.Application;
const httpServer = createServer(app);

//prepare io
export const io :Server = new Server(httpServer, {
   pingTimeout: 60000,
   cors:{
      credentials:true,
      origin: true
   }
});
app.set("io", io); 

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);

// global middlewares
app.use(
   cors({
     origin:true, 
     credentials: true,
   })
 );

 app.use(requestIp.mw());
 app.use(express.static("public"));


// Routes
import appRouter from "./routes/index.js";
import { UnprocessableEntity } from "./exceptions/validation.js";
import { ErrorCode } from "./exceptions/root.js";
import { ChatEventEnum, mountJoinChatEvent, mountParticipantStoppedTypingEvent, mountParticipantTypingEvent } from "./socket/index.js";
import { prisma } from "./config/prisma.js";

app.use('/api', appRouter);
//testing route
app.get('/', async (req, res) => {
  res.send("app working");
});

const startServer = () => {
   httpServer.listen(PORT || 8080, () => {
     console.log(`⚙️ Server is running http://${HOST}:${PORT}`);
   });
 };
 
 startServer();

// --------------------- Socket io --------------------//
io.on("connect", async (socket: Socket) => {
    try {
      console.log("....... start connectng ..",socket.id)
   
      // Parse cookies from handshake headers
      let token = socket.handshake.headers.authorization;
      
      // If token still not found, throw error
      if (!token) {
        throw new UnprocessableEntity("Un-authorized handshake. Token is missing", 500, ErrorCode.TOKEN_NOT_FOUND, null);
      }   
 
      console.log("--++++++++++++++++++++++++------------  token is there  for socket ------++++++++++++------------")
     console.log(token);
      // Verify and decode the token
      const decodedToken = jwt.verify(token, 'tsehaymemartiwedalech') as any; 
      const user = await prisma.users.findFirst({
        where:{
          id: +decodedToken.id
        }
      });
      console.log(decodedToken);

    
      // If user not found, throw error
      if (!user) {
        throw new UnprocessableEntity("Un-authorized handshake.", 500, ErrorCode.TOKEN_NOT_FOUND, null);
      }

      // Assign user object to socket
      socket.user = user;

      // Join a room with user ID
      socket.join(user.id.toString());
      
      // Emit connected event
      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log("User connected 🗼. userId: ", user.id.toString());
      // Mount common event handlers
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);
      
      // Handle disconnection event
      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id.toString());
        }
      });
    } catch (error: any) {
      console.log(error.message())
      // Emit socket error event if any error occurs during connection
      socket.emit(ChatEventEnum.SOCKET_ERROR_EVENT, error?.message || "Something went wrong while connecting to the socket.");
    }
  });