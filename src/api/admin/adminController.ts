import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response, response } from "express";
import { prisma } from "../../config/prisma.js";
import { JWT_EXPIRESIN, SECRET } from "../../config/secrets.js";
import { BadRequest } from "../../exceptions/badRequest.js";
import { ErrorCode } from "../../exceptions/root.js";
import { STATUS_CODES } from "http";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import authSchema from "./authSchema.js";
import { generateOTP } from "../../util/generateor.js";

const authController = {
  //register
  registerAdmin: async (req: Request, res: Response, next: NextFunction) => {
    authSchema.registerAdmin.parse(req.body);
    //check if the email or phone used befor
    const isAdminExist = await prisma.admins.findFirst({
      where: {
        OR: [{ email: req.body.email }, { phone: req.body.phone }],
      },
    });
    if (isAdminExist) {
      return res.status(403).json({
        success: false,
        message: "Email or Phone has been registered before",
      });
      
    }
    // create the admin
    const otp = generateOTP();
    const password = bcrypt.hashSync(req.body.password, 10);
    const newAdmin = await prisma.admins.create({
      data: {
        email: req.body.email,
        phone: req.body.phone,
        password: password,
        otp: otp,
        profile: {
          create: {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            imageUrl: req.body.imageUrl,
          },
        },
      },
      // include: {
      //   profile: true,
      // },
      select: {
        email: true,
        phone: true,
        profile: true,
        role: true,
        activeStatus: true,
      },
    });
    res.status(201).json(newAdmin);
  },
  //login admin
  loginAdmin: async (req: Request, res: Response, next: NextFunction) => {
    authSchema.login.parse(req.body);
    const admin = await prisma.admins.findFirst({
      where: { email: req.body.email },
    });

    console.log(admin);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "No account found with this email",
      });
      
    }
    const isMatch = bcrypt.compareSync(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password",
      });

    }
    const adminProfiles = await prisma.adminProfiles.findFirst({
      where: { adminId: admin.id },
    });

    console.log(adminProfiles);
    // Create token
    const payload = {
      id: admin.id,
      role: admin.role,
      firstName: adminProfiles?.firstName,
    };
    const token = await jwt.sign(payload, SECRET as string, {
      // expiresIn: JWT_EXPIRESIN,
    });
    return res.status(200).json({
      status: "success",
      message: "Login successfully",
      token,
      data: {
        firstName: adminProfiles?.firstName,
        lastName: adminProfiles?.lastName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        imageUrl: adminProfiles?.imageUrl,
      },
    });
  },
  myInfo: async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.admin);
    const admin = await prisma.admins.findFirst({
      where: { id: req.body.admin.id },
      select: {
        email: true,
        phone: true,
        role: true,
        profile: true,
        _count: true,
      },
    });

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Admin not found",
      });
     
    }

    return res.status(200).json({
      status: "success",
      message: "New admin is created successfully",
      admin: admin,
    });
  },
  getAdmins: async (req: Request, res: Response, next: NextFunction) => {
    const admins = await prisma.admins.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        activeStatus: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
      where: {
        role: {
          not: "SUPER",
        },
      },
    });
    if (!admins) {
      return res.status(403).json({
        success: false,
        message:  "No Admins found",
      });
      
    }

    return res.status(200).json(admins);
  },
};
export default authController;
