import express from "express";
import cors from 'cors';
import jwt from "jsonwebtoken";
import requestIp from "request-ip";
import { CORS_ORIGIN, HOST, PORT, SECRET } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
// import { ChatEventEnum, initializeSocketIO, emitSocketEvent } from './socket/index.js'
const app = express() as express.Application; // Explicitly specify the type
const httpServer = createServer(app);

//prepare io
export const io :Server = new Server(httpServer, {
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
import axios from "axios";
import { UnprocessableEntity } from "./exceptions/validation.js";
import { ErrorCode } from "./exceptions/root.js";
import { ChatEventEnum, mountJoinChatEvent, mountParticipantStoppedTypingEvent, mountParticipantTypingEvent } from "./socket/index.js";
import { prisma } from "./config/prisma.js";
app.use('/api', appRouter);
//testing route
app.get('/', async (req, res) => {
  // sendSMS('+251904825407','ye yoseph lij endet nesh ' );
  // sendSMS22('+251904825407','ye yoseph lij mohanud endet nesh ' );
  // const mess= {
  //   "secret": UNCG_API,
  //   "mode": "devices",
  //   "device": "00000000-0000-0000-d57d-f30cb6a89289",
  //   "sim": 1,
  //   "priority": 1,
  //   "phone": "+251965199682",
  //   "message": "Hello World!"
  // }
  // try {
  //   const response = await axios.post('https://sms.uncgateway.com/api/send/sms',{params: mess});
  //   console.log(response.data);
    
  // } catch (error: any) {
  //   console.log(error.message)
  // }

  //sikar
  // const bd = {
  //   "template_id": "EntertemplateID",
  //   "short_url": "1 (On) or 0 (Off)",
  //   "recipients": [
  //     {
  //       "mobiles": "251904825407",
  //       "VAR1": "VALUE 1",
  //       "VAR2": "VALUE 2"
  //     }
  //   ]
  // };
  
  // try {
  //   const response = await axios.post('https://control.msg91.com/api/v5/flow/', bd, {
  //   headers: {
  //     "authkey": SIKAR_API,
  //     "content-type": "application/json" // Changed to lowercase 'json'
  //   }
  // });
  // console.log(response.data);
    
  // } catch (error: any) {
  //   console.log(error.message)
  // }
  
  //my
  // let username = 'zeru0429';
  // let password = 'OpenAi@2023';
  // let postData = JSON.stringify({
  //   'to' : ['+251904825407', '+251965199682'],
  //   'body': 'Hello Yosi!'
  // });


  // let auth = Buffer.from(`${username}:${password}`).toString('base64');
  // let config = {
  //   method: 'post',
  //   url: 'https://api.bulksms.com/v1/messages',
  //   headers: { 
  //     'Content-Type': 'application/json', 
  //     'Authorization': `Basic ${auth}`
  //   },
  //   data : postData
  // };
  // axios(config)
  // .then((response) => {
  //   console.log('statusCode:', response.status);
  //   console.log("Response:", response.data);
  // })
  // .catch((error) => {
  //   console.error(error);
  // });
  

  res.send("app working");
});

const startServer = () => {
   httpServer.listen(PORT || 8080, () => {
     console.log(`⚙️ Server is running http://${HOST}:${PORT}`);
   });
 };
 

 startServer();
// app.listen(PORT, () => console.log(`Server is running http://${HOST}:${PORT}`));

// ------ Socket io ---------//

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
      // Verify and decode the token
      const decodedToken = jwt.verify(token, 'tsehaymemartiwedalech') as any; 
      const user = await prisma.users.findFirst({
        where:{
          id: +decodedToken.id
        }
      })
    
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
      console.log(error)
      // Emit socket error event if any error occurs during connection
      socket.emit(ChatEventEnum.SOCKET_ERROR_EVENT, error?.message || "Something went wrong while connecting to the socket.");
    }
  });