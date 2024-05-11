import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { SECRET } from "../config/secrets.js";
import { prisma } from "../config/prisma.js";
import { Unauthorized } from "../exceptions/unauthorized.js";
import { any } from "zod";
import { NotFound } from "../exceptions/notFound.js";
import { AdminRole, Admins, UserRole, Users } from "@prisma/client";

const adminAuth: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Token not found",
    });
    
  }
  try {
    const payload = (await jwt.verify(token, SECRET!)) as any;
    const admin = await prisma.admins.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!admin) {
      return next(
        new NotFound("user not found", 404, ErrorCode.USER_NOT_FOUND, null)
      );
    }
    req.body.admin = {
      id: admin.id,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "invalide token",
    });
    
  }
};
const userAuth: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.body);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Token not found",
    });
    
  }
  try {
    const payload = (await jwt.verify(token, SECRET!)) as any;
    const user = await prisma.users.findFirst({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      return next(
        new NotFound("User not found", 404, ErrorCode.USER_NOT_FOUND, null)
      );
    }
    req.user = user;
    // console.log(req.user);
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "invalide token",
    });
  }
};



const isSuperAdmin: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin: Admins | undefined = req.admin;
  if (admin && admin.role !== AdminRole.SUPER) {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};

const isAdmin: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin: Admins | undefined = req.admin;
  if (admin && admin.role !== AdminRole.ADMIN) {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};

const isHealthProfetional: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: Users | undefined = req.user;
  if (user && user.role !== UserRole.HEALTH_PROFETIONAL) {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};

const isManager: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: Users | undefined = req.user;
  if (user && user.role !== UserRole.MANAGER) {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isReception: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: Users | undefined = req.user;
  if (user && user.role !== UserRole.RECEPTION) {
    return next(
      new Unauthorized(
        "user not reception",
        401,
        ErrorCode.USER_NOT_FOUND,
        null
      )
    );
  }
  next();
};

const isMother: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: Users | undefined = req.user;
  if (user && user.role !== UserRole.MOTHER) {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};

const isEmployee: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: Users | undefined = req.user;
  if (user && user.role === UserRole.MOTHER) {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};

export {
  adminAuth,
  userAuth,
  isSuperAdmin,
  isAdmin,
  isManager,
  isHealthProfetional,
  isReception,
  isMother,
  isEmployee,
};
