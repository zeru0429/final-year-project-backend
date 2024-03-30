import { Request } from "express";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import cookie from "cookie";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { DATABASE_URL, SECRET } from "../config/secrets.js";
import { prisma } from "../config/prisma.js";

// Enum for different chat events
enum ChatEventEnum {
  CONNECTED_EVENT = "connected",
  DISCONNECT_EVENT = "disconnect",
  JOIN_CHAT_EVENT = "joinChat",
  LEAVE_CHAT_EVENT = "leaveChat",
  UPDATE_GROUP_NAME_EVENT = "updateGroupName",
  MESSAGE_RECEIVED_EVENT = "messageReceived",
  NEW_CHAT_EVENT = "newChat",
  SOCKET_ERROR_EVENT = "socketError",
  STOP_TYPING_EVENT = "stopTyping",
  TYPING_EVENT = "typing",
}

// Function to handle joining a chat
const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId: string) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

// Function to handle participant typing event
const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

// Function to handle participant stopped typing event
const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

// Function to emit socket event
const emitSocketEvent = (req:Request, roomId:String, event: ChatEventEnum, payload:any) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

// Function to initialize Socket.IO
const initializeSocketIO = (io: Socket) => {
  io.on("connection", async (socket: Socket) => {
    try {
      // Parse cookies from handshake headers
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      let token = cookies?.accessToken;
      
      // If token not found in cookies, check handshake auth
      if (!token) {
        token = socket.handshake.auth?.token;
      }
      
      // If token still not found, throw error
      if (!token) {
        throw new UnprocessableEntity("Un-authorized handshake. Token is missing", 500, ErrorCode.TOKEN_NOT_FOUND, null);
      }
      
      // Verify and decode the token
      const decodedToken = jwt.verify(token, SECRET!) as any; 
      
      // Fetch user details from database using decoded token
      const user = await prisma.users.findFirst({
        where: {
          id: +decodedToken.id,
        },
        include:{
          participantInChats: true,
          sentMessages: true,
          profile: true,
          _count:true
        }
      });
      
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
      // Emit socket error event if any error occurs during connection
      socket.emit(ChatEventEnum.SOCKET_ERROR_EVENT, error?.message || "Something went wrong while connecting to the socket.");
    }
  });
};


// Export enum and functions for external use
export { ChatEventEnum, initializeSocketIO, emitSocketEvent };

