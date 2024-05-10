import express, { NextFunction, Request } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import requestIp from "request-ip";
import { CORS_ORIGIN,HOST, PORT, SECRET } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express() as express.Application;
const httpServer = createServer(app);

//prepare io
export const io: Server = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    credentials: true,
    origin: true,
  },
});
app.set("io", io);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);

// global middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(requestIp.mw());
app.use(express.static("public"));

// Routes
import appRouter from "./routes/index.js";
import { UnprocessableEntity } from "./exceptions/validation.js";
import { ErrorCode } from "./exceptions/root.js";
import {
  ChatEventEnum,
  OnlineUser,
  emitSingleSocketEvent,
  emitSocketEvent,
  mountJoinChatEvent,
  mountParticipantStoppedTypingEvent,
  mountParticipantTypingEvent,
  onlineUsers,
} from "./socket/index.js";
import { prisma } from "./config/prisma.js";
import { userAuth } from "./middlewares/auth.js";

app.use("/api", appRouter);

//testing route
app.get("/", [userAuth],async (req : Request, res: Response,next: NextFunction) => {
 
  const payload = {
    "id": 1,
    "userId": 10,
    "message": "This is a sample message.",
    "createdAt": "2022-05-10T10:30:00Z",
    "seen": false
  }

  // req.user!.id = 10;

  // return  res.send("app working");
  emitSingleSocketEvent(
    req,
    10,
    ChatEventEnum.NOTIFICATION,
    payload
  );
  return res.send("woring");
  
 
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
    console.log("....... start connectng ..", socket.id);

    // Parse cookies from handshake headers
    let token1 = socket.handshake.query.token;
    let token2 = socket.handshake.headers.authorization;
    let token =null;
    if(token1==null){
      token = token2;
    }
    else{
      token = token1;
    }
    // If token still not found, throw error
    if (!token) {
      return new UnprocessableEntity(
        "Un-authorized handshake. Token is missing",
        500,
        ErrorCode.TOKEN_NOT_FOUND,
        null
      );
    }

    console.log(
      "--++++++++++++++++++++++++------------  token is there  for socket ------++++++++++++------------"
    );
    // Verify and decode the token
    const decodedToken = jwt.verify(token.toString(), SECRET!) as any;
    const user = await prisma.users.findFirst({
      where: {
        id: +decodedToken.id,
      },
    });
    // console.log(decodedToken);

    // If user not found, throw error
    if (!user) {
      return new UnprocessableEntity(
        "Un-authorized handshake.",
        500,
        ErrorCode.TOKEN_NOT_FOUND,
        null
      );
    }

    // Assign user object to socket
    socket.user = user;
   console.log(onlineUsers);
    // Join a room with user ID
    socket.join(user.id.toString());
    // Add user to the list of online users
  // Add user to the list of online users
     // Check if the user is already online
     const isUserOnline = onlineUsers.some(onlineUser => onlineUser.id === user.id.toString());
     if (!isUserOnline) {
       // Add user to the list of online users
       const onlineUser: OnlineUser = { id: user.id.toString(), socket: socket.id };
       onlineUsers.push(onlineUser);
     }
    console.log(onlineUsers);
    // Broadcast updated list of online users to all connected clients
    io.emit("onlineUsers", onlineUsers);
    // Emit connected event
    socket.emit(ChatEventEnum.CONNECTED_EVENT);
    console.log("User connected 🗼. userId: ", user.id.toString());
    console.log(onlineUsers);
    // Mount common event handlers
    mountJoinChatEvent(socket);
    mountParticipantTypingEvent(socket);
    mountParticipantStoppedTypingEvent(socket);

    // Handle disconnection event
    socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
      console.log("user has disconnected 🚫. userId: " + socket.user?.id);
      console.log(onlineUsers);
      if (socket.user?.id) {
        socket.leave(socket.user.id.toString());
        // Remove user from the list of online users
       // Remove user from the list of online users
       const index = onlineUsers.findIndex(user => user.id === socket.user?.id?.toString());
       if (index !== -1) {
         onlineUsers.splice(index, 1);
       }

        // Broadcast updated list of online users to all connected clients
        io.emit("onlineUsers", onlineUsers);
      }
    });
  } catch (error: any) {
    console.log(error.message);
    // Emit socket error event if any error occurs during connection
    socket.emit(
      ChatEventEnum.SOCKET_ERROR_EVENT,
      error?.message || "Something went wrong while connecting to the socket."
    );
  }
});

