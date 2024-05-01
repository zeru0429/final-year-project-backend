import { Request } from "express";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import {io} from '../app.js'
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { DATABASE_URL, SECRET } from "../config/secrets.js";
import { prisma } from "../config/prisma.js";

export interface OnlineUser {
  id: string;
  socket: string;
  // You can add more properties if needed
}

// Define a global array to store online users
let onlineUsers: OnlineUser[] = [];

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

const emitSocketEvent = (req:Request, roomId:any ,event: ChatEventEnum, payload:any) => {
    let id ='';
    onlineUsers.map((e)=>{
      if((e.id==roomId.id) &&  (req.user!.id != roomId.id)){
      id = e.socket
      }
    });
    console.log(id);
    io.to(id).emit(event, payload);
};

// Function to initialize Socket.IO
const initializeSocketIO = (io: Server) => {  
  
};



// Export enum and functions for external use
export {onlineUsers, ChatEventEnum,initializeSocketIO, emitSocketEvent,mountJoinChatEvent,mountParticipantStoppedTypingEvent,mountParticipantTypingEvent, };

