import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import userSchema from "./userSchema.js";
import bcrypt from "bcrypt";
import { SECRET } from "../../config/secrets.js";
import { generateOTP } from "../../util/generateor.js";
import { sendEmail } from "../../util/emailSender.js";
const usersController = {
  updatedEmailAndPhone: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.userId = +req.params.id;
    userSchema.updateEmailAndPhone.parse(req.body);
    //check if  user exist
    const isUserExist = await prisma.users.findFirst({
      where: {
        AND: [
          { id: +req.userId },
          { role: req.body.role },
          { healthStationId: req.body.healthStationId },
        ],
      },
    });
    if (!isUserExist) {
      return next(
        new UnprocessableEntity(
          "no user found in this id",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    //check if the email and phone used befor
    const isEmailAndPhoneUsed = await prisma.users.findFirst({
      where: {
        OR: [{ email: req.body.email }, { phone: req.body.phone }],
      },
    });
    if (isEmailAndPhoneUsed) {
      return next(
        new UnprocessableEntity(
          "Email or Phone has been registered before",
          403,
          ErrorCode.USER_ALREADY_EXIST,
          null
        )
      );
    }
    //start updateing
    const updatedUser = await prisma.users.update({
      where: { id: +req.userId },
      data: { email: req.body.email, phone: req.body.phone },
    });
    res.status(200).json(updatedUser);
  },
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    //check if user exist
    const isUser = await prisma.users.findFirst({
      where: { id: req.user!.id },
    });
    if (!isUser) {
      return next(
        new UnprocessableEntity(
          "user not found",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    //check if the old passwod is correct
    const isMatch = await bcrypt.compareSync(
      req.body.oldPassword,
      isUser!.password
    );
    if (!isMatch) {
      return next(
        new UnprocessableEntity(
          "incorrect old passwod",
          403,
          ErrorCode.INCORRECT_OLD_PASSWORD,
          null
        )
      );
    }
    req.body.newPasswod = bcrypt.hashSync(req.body.newPasswod, 10);
    //update password
    const updatedPassword = await prisma.users.update({
      where: { id: req.user!.id },
      data: { password: req.body.newPasswod },
    });
    res.status(200).json(updatedPassword);
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    // check if user exist usind id and role
    const isUserExist = await prisma.users.findFirst({
      where: {
        AND: [{ id: +req.userId }, { role: req.body.role }],
      },
    });
    if (!isUserExist) {
      return next(
        new UnprocessableEntity(
          "no user found in this id",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    //start deleting
    const isUserDeleted = await prisma.users.delete({
      where: {
        id: +req.userId,
      },
    });
    res.status(200).json({
      message: "sucessfully deleted",
      sucess: true,
    });
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await prisma.users.findMany();
    res.status(200).json(allUsers);
  },
  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    const isUser = await prisma.users.findFirst({ where: { id: +req.userId } });
    res.status(200).json(isUser);
  },
  getByHs: async (req: Request, res: Response, next: NextFunction) => {
    req.hsId = +req.params.hsId;
    //check if hs exist
    const isHsExist = await prisma.healthStations.findFirst({
      where: { id: +req.hsId },
    });
    if (!isHsExist) {
      return next(
        new UnprocessableEntity(
          "no health Station found found in this id",
          404,
          ErrorCode.HS_NOT_FOUND,
          null
        )
      );
    }
    // get all users in that hs
    const allUsersInHs = await prisma.users.findMany({
      where: { healthStationId: +req.hsId },
    });
    res.status(200).json(allUsersInHs);
  },
  //login user
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    userSchema.login.parse(req.body);
    console.log(req.body);
    const user = await prisma.users.findFirst({
      where: { email: req.body.email },
    });
    if (!user) {
      return next(
        new UnprocessableEntity(
          "No account found with this email",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return next(
        new UnprocessableEntity(
          "Incorrect password",
          403,
          ErrorCode.INCORRECT_PASSWORD,
          null
        )
      );
    }
    const userProfile = await prisma.userProfiles.findFirst({
      where: { userId: user.id },
    });
    // Create token
    const payload = {
      id: user.id,
      role: user.role,
      firstName: userProfile?.firstName,
    };
    const token = jwt.sign(payload, SECRET!);
    return res.status(200).json({
      token,
      message: "Login successfully",
    });
  },
  myInfo: async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.users.findFirst({
      where: { id: +req.user!.id },
      include: {
        _count: true,
        profile: true,
        motherProfile: {
          include:{
            vaccine:{
              include:{
                 vaccine:true,
                 registrar:{
                    include:{
                       profile:true,
                       proProfile:true,
                    }
                 }

              }
           },
            child: {
              include:{
                vaccine:{
                  include:{
                     vaccine:true,
                     registrar:{
                        include:{
                           profile:true,
                           proProfile:true,
                        }
                     }

                  }
               },
                certificate: {
                  include:{
                    healthStation:true,
                    registrar: true,
                  }
                },
                registrar:{
                  include:{
                    profile:true,
                    proProfile:true
                  },
                },
                appointment: {
                  include:{
                    registrar:{
                      include:{
                        profile:true,
                        proProfile:true,
                        healthStation:true,
                      
                      }
                    }
                  }
                },
                _count:true,
                
              }
            },
            appointment: true,
            
          }
        },
        proProfile: true,
        adminOfChats: true,
        appointment: true,
        certifications: true,
        childVaccine: true,
        healthStation: true,
        motherVaccine: true,
        notification: true,
        participantInChats: {
          include: {
            messages: true,
            admin: true,
            participants: {
              include: {
                profile: true,
              },
            },
            _count: true,
          },
        },
        sentMessages: true,
        report: true,
      },
    });
    res.status(200).json(user);
  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    userSchema.forgetPassowd.parse(req.body);
    const user = await prisma.users.findFirstOrThrow({
      where: {
        email: req.body.email,
      },
      include: {
        profile: true,
      },
    });
    if (!user) {
      return next(
        new UnprocessableEntity(
          "No account found with this email",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    // prepare token
    const payload = {
      id: user.id,
      role: user.role,
      firstName: user.profile?.firstName,
    };
    const token = jwt.sign(payload, SECRET!);
    //generate 6 didgit code
    const otp = generateOTP();
    // // //store in to database
    const otpUser = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        otp: otp,
        // otpCreatedAt: Date.now(),
        // otpExpiry: new Date(`${Date.now() + 60 * 60 * 24000}`),
      },
    });
    //send email
    const emailDelivered = await sendEmail(otpUser.email, `${otp}`);
    if (emailDelivered.success == false) {
      return next(
        new UnprocessableEntity(
          `unable to send email ${emailDelivered.message}`,
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    //send response
    res.status(200).json({
      success: true,
      message: emailDelivered.message,
      token
    });
  },
  confirmOtp: async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.users.findFirst({
      where: { id: +req.user!.id },
      include: {
        profile: true,
      },
    });
    if (!user) {
      return next(
        new UnprocessableEntity(
          "No account found with this email",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    const { otp } = req.body;
    if (otp != user.otp) {
      return next(
        new UnprocessableEntity(
          "Incorrect otp",
          403,
          ErrorCode.INCORRECT_OTP,
          null
        )
      );
    }
    // const otpExpiry = user.otpExpiry;
    // const expiryDate = new Date(otpExpiry!);
    // if (expiryDate < new Date()) {
    //   return next(
    //     new UnprocessableEntity("expired otp", 403, ErrorCode.EXPIRED_OTP, null)
    //   );
    // }

    // remove otp and set null
    const udpadteUser = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        otp: "000000",
        otpCreatedAt: null,
        otpExpiry: null,
      },
    });
    // Create token
    const payload = {
      id: user.id,
      role: user.role,
      firstName: user.profile?.firstName,
    };
    const token = jwt.sign(payload, SECRET!);
    return res.status(200).json({
      message: "Otp confirmed",
      data: udpadteUser,
      token,
    });
  },
  newPassword: async (req: Request, res: Response, next: NextFunction) => {
    userSchema.newPassword.parse(req.body);
    if (req.body.passwod != req.body.cpasswod) {
      return next(
        new UnprocessableEntity(
          "password and confirm password does not mutch ",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    console.log(req.user!.otp);
     // check if the otp is confirmed
     if( req.user!.otp =='00000' )     {
      return next( new UnprocessableEntity(
        "the otp is not cofirmed yet",
        403,
        ErrorCode.USER_NOT_FOUND,
        null

      ));
     }
     // hash the password

     req.body.cpassword = bcrypt.hashSync(req.body.cpassword, 10);
     console.log(req.body.cpasswod);
  
    //  know chenge password
     const updatedUser = await prisma.users.update({
      where: {
        id: req.user!.id,
      },
      data: {
        password: req.body.cpasswod,
        otp: null
      }
     });
 
   return res.status(200).json(updatedUser);
  },
};

export default usersController;
