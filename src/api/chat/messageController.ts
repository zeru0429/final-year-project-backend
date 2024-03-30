import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../../exceptions/root.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { prisma } from "../../config/prisma.js";
import { ChatEventEnum, emitSocketEvent } from "../../socket/index.js";


const messageController = {
   sendMessage: async (req: Request, res:Response,next: NextFunction) => {
      req.chatId = +req.params.id;
      const {content} = req.body;
      //check if it containes
      if (!content && !req.files?.attachments?.length) {
      return next(new UnprocessableEntity('content and attachments are required', 422, ErrorCode.CONTENT_AND_ATTACHMENTS_REQUIRED, null));
      }
      //find chat
      const chat = await prisma.chats.findFirstOrThrow({
         where: {
            id: +req.chatId
         },
         include:{
            participants: true,
         }
      });
      if(!chat){
         return next(new UnprocessableEntity('no chat found in this id',404,ErrorCode.CHAT_NOT_FOUND,null));
      }
      //pprepare attachmebt
      const messageFiles = [];
      if (req.files && req.files.attachments?.length > 0) {
         req.files.attachments?.map((attachment: any) => {
            messageFiles.push({
               url: attachment.url
            });
         });
       }
   // Create a new message instance with appropriate metadata
      const newMessage = await prisma.messages.create({
         data: req.body
      });
      // update the chat's last message which could be utilized to show last message in the list item
      const _chat = await prisma.chats.update({
         where: {
            id: +req.chatId
         },
         data: {
            lastMessage: {
               connect: {
                  id: newMessage.id
               }
            }
         }
      });
      const msglast = await prisma.chats.findFirst({ include:{
      lastMessage:true
      },
      where:{
      id: +req.chatId
      }});
      const receivedMessage = msglast?.lastMessage;
      // logic to emit socket event about the new message created to the other participants
      chat.participants.forEach((participantObjectId) => {
      // here the chat is the raw instance of the chat in which participants is the array of object ids of users
      // avoid emitting event to the user who is sending the message
      if (participantObjectId.toString() === req.user?.id.toString()) return;

      // emit the receive message event to the other participants with received message as the payload
      emitSocketEvent(
      req,
      participantObjectId.toString(),
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      receivedMessage 
      );
      });
      return res.status(201).json({
      message:  "Message saved successfully",
      sucess: true});
   },

   getMessages: async (req: Request, res:Response,next: NextFunction) => {
      req.chatId = +req.params.id;
      //check if the user is participant of the chat
      const chat = await prisma.chats.findFirstOrThrow({
         where: {
            id: +req.chatId
         },
         include:{
            participants: true,
         }
      });
      if(!chat){
         return next(new UnprocessableEntity('no chat found in this id',404,ErrorCode.CHAT_NOT_FOUND,null));
      }
     if(chat.participants.find((participant) => participant.id === req.user?.id) === undefined){
         return next(new UnprocessableEntity('you are not a participant of this chat',404,ErrorCode.CHAT_NOT_FOUND,null));
      }
      const messages = await prisma.messages.findMany({
         where: {
            chatId: +req.chatId
         },
         include:{
            _count:true,
            attachments: true,
            chat: true,
            sender:true
         }
      });
      
      return res.status(200).json({
         message: "sucessfully fetched",
         sucess: true,
         data: messages
      });
   },
   

}
export default messageController;