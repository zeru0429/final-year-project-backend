import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../../exceptions/root.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { prisma } from "../../config/prisma.js";
import {
  ChatEventEnum,
  emitSocketEvent,
  onlineUsers,
} from "../../socket/index.js";
import { BASE_URL } from "../../config/secrets.js";
import { url } from "inspector";

const messageController = {
  sendMessage: async (req: Request, res: Response, next: NextFunction) => {
    let dataUrl = null;
    req.chatId = +req.params.id;
    const { content } = req.body;
    // Check if content or attachments are provided
    if (
      !content &&
      (!req.files?.attachments || req.files.attachments.length === 0)
    ) {
      return next(
        new UnprocessableEntity(
          "Content or attachments are required",
          422,
          ErrorCode.CONTENT_AND_ATTACHMENTS_REQUIRED,
          null
        )
      );
    }

    // Find the chat
    const chat = await prisma.chats.findFirst({
      where: {
        id: +req.chatId,
      },
      include: {
        participants: true,
      },
    });
    if (!chat) {
      return next(
        new UnprocessableEntity(
          "No chat found with this id",
          404,
          ErrorCode.CHAT_NOT_FOUND,
          null
        )
      );
    }

    // Prepare attachments
    const messageFiles = req.files?.attachments?.map((attachment: any) => ({
      url: attachment.filename,
    }));
    let newMessage: any;
    if (content !== null && content !== undefined) {
      newMessage = await prisma.messages.create({
        data: {
          chatId: +req.chatId,
          senderId: req.user!.id,
          sentTime: new Date(),
          content: content,
        },
      });
    } else {
      const url = `${BASE_URL}images/${messageFiles[0].url}`;
      console.log(url);
      dataUrl = url;
      // console.log(url);
      newMessage = await prisma.messages.create({
        data: {
          chatId: +req.chatId,
          senderId: req.user!.id,
          sentTime: new Date(),
          content: "attachments",
          attachments: {
            create: {
              url: url,
            },
          },
        },
        include:{
          attachments: true
        }
      });
    }
    // Create a new message instance with appropriate metadata
    // Update the chat's last message
    await prisma.chats.update({
      
      where: {
        id: +req.chatId,
      },
      data: {
        lastMessageI: newMessage.id,
      },
    });


    // Emit socket event about the new message created to the other participants
    chat.participants.forEach((participantObjectId: any) => {
      // Avoid emitting event to the user who is sending the message
      if (participantObjectId.id.toString() === req.user?.id.toString()) {
        return;
      } else {
        if (onlineUsers.some(participant => participant.id === participantObjectId.id.toString())) {
         
          emitSocketEvent(
            req,
            participantObjectId.id,
            ChatEventEnum.MESSAGE_RECEIVED_EVENT,
            newMessage
          );
        }
        
      }
    });
    console.log(dataUrl);
    return res.status(201).json({
      message: "Message saved successfully",
      success: true,
      url: dataUrl,
    });
  },

  getMessages: async (req: Request, res: Response, next: NextFunction) => {
    req.chatId = +req.params.id;
    //check if the user is participant of the chat
    const chat = await prisma.chats.findFirstOrThrow({
      where: {
        id: +req.chatId,
      },
      include: {
        participants: true,
      },
    });
    if (!chat) {
      return next(
        new UnprocessableEntity(
          "no chat found in this id",
          404,
          ErrorCode.CHAT_NOT_FOUND,
          null
        )
      );
    }
    // Check if the participant being added is already a part of the group
    if (
      chat.participants.find(
        (participant: any) => participant.id === req.user?.id
      ) === undefined
    ) {
      return next(
        new UnprocessableEntity(
          "you are not a participant of this chat",
          404,
          ErrorCode.CHAT_NOT_FOUND,
          null
        )
      );
    }
    const messages = await prisma.messages.findMany({
      where: {
        chatId: +req.chatId,
      },
      skip: +req.query.skip!,
      take: +req.query.take!,
      include: {
        _count: true,
        attachments: true,
        chat: true,
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(200).json({
      message: "sucessfully fetched",
      sucess: true,
      data: messages,
    });
  },
  updateMessage: async (req: Request, res: Response, next: NextFunction) =>{
    const chatId = req.params.id;
    const reciverId = req.user?.id;
    console.log("----------------",chatId,reciverId);
    const chat = await prisma.messages.findFirst({
      where:{
        id: +chatId,
      }
    });
    if(!chatId){
      return next(new UnprocessableEntity('No chat found with this id', 404, ErrorCode.CHAT_NOT_FOUND, null));
    }
    const messages = await prisma.messages.findMany({
      where:{
        chatId: +chatId,
        seen: false
      },

    });
    if(!messages || messages.length==0){
      return res.status(200).json({
        success: true,
        message: "all messages are updated",
      });
    }
    // make all messages that are recived by user seen
    const updatedMessages = await prisma.messages.updateMany({
      where: {
        chatId: +chatId,
        senderId: {
          not: +reciverId!,
        }
      },
      data: {
        seen: true
      }
    });
    // console.log(updatedMessages);
      return res.status(200).json({
      success: true,
      message: "all messages are updated",
      data: updatedMessages
    });
  }
};
export default messageController;
