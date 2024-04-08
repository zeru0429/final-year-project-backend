import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import { ChatEventEnum, emitSocketEvent } from "../../socket/index.js";


const chatController = {
   //get chats
   getAllChat: async (req:Request, res:Response, next:NextFunction) => {
      const chat = await prisma.chats.findMany({
         where:{
            participants:{
               some:{
                  id: req.user?.id
               }
            }
         }
      });

      res.status(200).json(chat);
      
   },
   getAllMyChat: async (req:Request, res:Response, next:NextFunction) => {
      const chat = await prisma.chats.findMany({
         include:{
            participants:{
               include:{
                   profile: true,
                   _count:true
               }
            },
            admin:{
               include:{
                  profile:true,
               }
            },
            messages: {
               include:{
                  attachments: true,
                  _count:true,
               }
            }
         },
         where:{
            participants:{
               some:{
                  id: req.user?.id
               }
            }
         }
      });

      res.status(200).json(chat);
      
   },
   //group chat
   createAGroupChat: async (req:Request, res:Response, next:NextFunction) => {
      const { name, participants } = req.body;
      // Check if user is not sending himself as a participant. This will be done manually
      if (participants.includes(req.user?.id.toString())) {
         return next(new UnprocessableEntity('you can not add yourself to participants', 404, ErrorCode.USER_NOT_FOUND, null));
      }
      const members = [...new Set([...participants, req.user?.id.toString()])]; // check for duplicates
      if (members.length < 2) {
         // check after removing the duplicate
         // We want group chat to have minimum 3 members including admin
        return next(new UnprocessableEntity('group chat should have at least 2 members', 404, ErrorCode.USER_NOT_FOUND, null));
      }
      //  // Create a group chat with provided members
       const newChat = await prisma.chats.create({
         data: {
            lastMessageI: 1,
            name,
            isGroupChat: true,
            adminId: req.user?.id,
            createdAt: new Date(),
            participants: {
               connect: members.map((member) => ({ id: +member }))
            }
         }
       });
       
       const chat = await prisma.chats.findFirstOrThrow({
         where:{
            id: newChat.id
         },
         include:{
            participants: true
         }
       });
      //  // Send notification about this new group chat
       chat.participants?.forEach((participant) => {
         if (participant.id.toString() === req.user?.id.toString()) return; // don't emit the event for the logged in use as he is the one who is initiating the chat
         // emit event to other participants with new chat as a payload
         emitSocketEvent(
           req,
           participant.id?.toString(),
           ChatEventEnum.NEW_CHAT_EVENT,
           chat
         );
       });

       res.status(200).json({
         message: 'Group chat created successfully',
         sucess: true
       });


   },
   //create one to one chat
   createOneToOneChat: async (req:Request, res:Response, next:NextFunction) => {
      const { receiverId } = req.params;  
   
       // Check if it's a valid receiver
       const receiver = await prisma.users.findFirst({
          where:{
            id: +receiverId
          }
       });
       if(!receiver){
         return next(new UnprocessableEntity('Receiver does not exist', 404, ErrorCode.USER_NOT_FOUND, null));
       }
      // // check if receiver is not the user who is requesting a chat
      if (receiver.id.toString() === req.user?.id.toString()) {
         return next(new UnprocessableEntity('you can not send message to yourself', 404, ErrorCode.USER_NOT_FOUND, null));        
       }
       
      //  //check if the one to one exist befor
       const oneToOneChat = await prisma.chats.findFirst({
         where:{
            isGroupChat: false,
            participants: {
               every: {
                  id: {
                     in: [req.user!.id, +receiverId]
                  }
               }
            }
         }
       });
       if(oneToOneChat){
         return res.status(200).json(oneToOneChat);
       }
      //  //create one to one chat
       const newOneToOneChat = await prisma.chats.create({
         data:{
            lastMessageI: 1,
            isGroupChat: false,
            participants: {
               connect: [
                  { id: req.user?.id },
                  { id: +receiverId }
               ]
            },
            name:"single"
         }
       });
      return res.status(200).json(newOneToOneChat);
   },
   //delete chat
   deleteChat: async (req:Request, res:Response, next:NextFunction) =>{
      const chatId = +req.params.id;
      // Check for chat existence
      const chat = await prisma.chats.findFirst({
          where: {
              id: chatId
          },
          include: {
              participants: true
          }
      });
      if (!chat) {
          return next(new UnprocessableEntity('Chat not found', 404, ErrorCode.HS_NOT_FOUND, null));
      }

      // Check if it's a group chat or one-to-one chat
      const isGroupChat = chat.isGroupChat;

      // Check if the user is authorized to delete the chat
      if (isGroupChat) {
          if (chat.adminId !== req.user?.id) {
              return next(new UnprocessableEntity('Only group admin can delete the group chat', 401, ErrorCode.UNPROCESSABLE, null));
          }
      } else {
          // For one-to-one chats, any participant can delete the chat
          const isParticipant = chat.participants.some(participant => participant.id === req.user?.id);
          if (!isParticipant) {
              return next(new UnprocessableEntity('You are not a participant of this chat', 401, ErrorCode.UNPROCESSABLE, null));
          }
      }

      // Delete the chat
      await prisma.chats.delete({
          where: {
              id: chatId
          }
      });

      // Emit leave chat event to participants
      chat?.participants?.forEach((participant) => {
          if (participant.id.toString() === req.user?.id.toString()) return;
          emitSocketEvent(
              req,
              participant.id?.toString(),
              ChatEventEnum.LEAVE_CHAT_EVENT,
              chat
          );
      });

      res.status(200).json({
          message: 'Chat deleted successfully',
          success: true
      });

   },

   //rename chat
   renameGroupChat: async (req:Request, res:Response, next:NextFunction) =>{
      req.chatId = +req.params.id;
      const { name } = req.body;
       // check for chat existence
       const chat = await prisma.chats.findFirst({
         where:{
            id: +req.chatId
         },
         include:{
            participants:true
         }
       });
       if(!chat) return next(new UnprocessableEntity('Group chat not found', 404, ErrorCode.HS_NOT_FOUND, null));
      // only admin can change the name
       if(chat.adminId!.toString() !== req.user?.id.toString()) return next(new UnprocessableEntity('Only group admin can change the name', 401, ErrorCode.UNPROCESSABLE, null));
       const updatedChat = await prisma.chats.update({
         where:{
            id: +req.chatId
         },
         data:{
            name
         }
       });
       res.status(200).json({
            message: 'Group chat renamed successfully',
            sucess: true
       });
   },
   //add new member
   addNewParticipantInGroupChat: async (req:Request, res:Response, next:NextFunction) =>{
      const chatId = +req.params.id;
      const { participantId } = req.body;
      // Check for chat existence
      const chat = await prisma.chats.findFirst({
          where: {
              id: chatId
          },
          include: {
              participants: true
          }
      });
      if (!chat) {
          return next(new UnprocessableEntity('Group chat not found', 404, ErrorCode.HS_NOT_FOUND, null));
      }
      // Check if current user is the admin of the chat
      if (chat.adminId !== req.user?.id) {
          return next(new UnprocessableEntity('Only group admin can add members', 401, ErrorCode.UNPROCESSABLE, null));
      }
      const existingParticipants = chat.participants.map(participant => participant.id);
      // Check if the participant being added is already a part of the group
      if (existingParticipants.includes(participantId)) {
          return next(new UnprocessableEntity('User already a part of the group', 401, ErrorCode.UNPROCESSABLE, null));
      }
      // Add new participant
      const updatedChat = await prisma.chats.update({
          where: {
              id: chatId
          },
          data: {
              participants: {
                  connect: {
                      id: participantId
                  }
              }
          }
      });

      // Emit socket event
      emitSocketEvent(req, participantId, ChatEventEnum.NEW_CHAT_EVENT, updatedChat);

      res.status(200).json({
         message: 'Participant added successfully',
         sucess: true
      });


   },
   //remove the member
   removeParticipantFromGroupChat: async (req:Request, res:Response, next:NextFunction) =>{
      req.chatId = +req.params.id;
      const { participantId  } = req.body;
      // check if chat is a group
      // check for chat existence
      const chat = await prisma.chats.findFirst({
      where:{
         id: +req.chatId
      },
      include:{
         participants:true
      }
      });
      if(!chat) return next(new UnprocessableEntity('Group chat not found', 404, ErrorCode.HS_NOT_FOUND, null));
       // only admin can change the name
      if(chat.adminId!.toString() !== req.user?.id.toString()) return next(new UnprocessableEntity('Only group admin can add the member the name', 401, ErrorCode.UNPROCESSABLE, null));
      //check the participant found in the group
      const existingParticipants = chat.participants.map(participant => participant.id);
   
      if(!existingParticipants?.includes(participantId)) return next(new UnprocessableEntity('Participant not found in the group', 401, ErrorCode.UNPROCESSABLE, null));
      //start removing participant
      const updatedChat = await prisma.chats.update({
         where:{
            id: +req.chatId
         },
         data:{
            participants:{
               disconnect:{
                  id: participantId
               }
            }
         }
      });
      // emit leave chat event to the removed participant
      emitSocketEvent(req, participantId, ChatEventEnum.LEAVE_CHAT_EVENT, updatedChat); 
      res.status(200).json({
         message: 'Participant removed successfully',
         sucess: true
      });
   },

}
export default chatController;