import { Router } from "express";
import errorHandler from "../../config/errorHandler.js";
import chatController from "./chatController.js";
import messageController from "./messageController.js";
import { userAuth } from "../../middlewares/auth.js";
import { upload } from "../../config/multer.js";


const chatRouter: Router = Router();

// //chat 
 chatRouter.post('/create/group',[userAuth], errorHandler(chatController.createAGroupChat));
 chatRouter.post('/create/onetoone/:receiverId',[userAuth], errorHandler(chatController.createOneToOneChat));
 chatRouter.get('/getmy',[userAuth],errorHandler(chatController.getAllMyChat));
 chatRouter.put('/rename/:id',[userAuth], errorHandler(chatController.renameGroupChat));
 chatRouter.put('/addparticipant/:id',[userAuth] ,errorHandler(chatController.addNewParticipantInGroupChat));
 chatRouter.put('/removeparticipant/:id', [userAuth] ,errorHandler(chatController.removeParticipantFromGroupChat));
 chatRouter.delete('/delete/:id', [userAuth] ,errorHandler(chatController.deleteChat));
 // messages
 chatRouter.get('/message/:id',[userAuth] , errorHandler(messageController.getMessages));
 chatRouter.post('/message/send/:id', [userAuth],upload.fields([{ name: "attachments", maxCount: 5 }]),errorHandler(messageController.sendMessage));
 chatRouter.put('/message/seen/:id', [userAuth],errorHandler(messageController.updateMessage));


export default chatRouter;