import { NextFunction, Request, Response } from "express";
import userSchema from "../userSchema.js";
import { prisma } from "../../../config/prisma.js";
import { UnprocessableEntity } from "../../../exceptions/validation.js";
import { ErrorCode } from "../../../exceptions/root.js";
import bcrypt from "bcrypt";

const employeeController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    //   userSchema.registerEmployee.parse(req.body);
    //check if the employye exist before
    const isEmployeeExist = await prisma.users.findFirst({
      where: {
        OR: [{ email: req.body.email }, { phone: req.body.phone }],
      },
    });
    console.log(isEmployeeExist);

    if (isEmployeeExist) {
      return res.status(403).json({
        success: false,
        message: "Email or Phone has been registered before",
      });
      
    }

    req.body.password = bcrypt.hashSync(req.body.password, 10);
    console.log(req.body);
    //create the employee
    const newUser = await prisma.users.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        role: req.body.role,
        healthStationId: req.body.healthStationId,
        profile: {
          create: {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            imageUrl: req.body.imageUrl,
            sex: req.body.sex,
          },
        },
        proProfile: {
          create: {
            healthStationId: req.body.healthStationId,
            position: req.body.position,
            title: req.body.title,
          },
        },
      },
      include: {
        profile: true,
        proProfile: true,
      },
    });
    return res.status(201).json(newUser);
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    const user = await prisma.users.findFirst({ where: { id: +req.userId } });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "no user found in this id",
      });
    }
    const updatedUser = await prisma.users.update({
      where: { id: +req.userId },
      data: {
        profile: {
          update: {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            imageUrl: req.body.imageUrl,
            sex: req.body.sex,
          },
        },
        proProfile: {
          update: {
            position: req.body.position,
            title: req.body.title,
          },
        },
      },
    });
    res.status(200).json(updatedUser);
  },
  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    const user = await prisma.users.findFirst({ where: { id: +req.userId } });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "no user found in this id",
      });
    }
    const updatedUser = await prisma.users.update({
      where: { id: +req.userId },
      data: {
        activeStatus: req.body.activeStatus,
      },
    });
    res.status(200).json(updatedUser);
  },
  assignRole: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    const user = await prisma.users.findFirst({ where: { id: +req.userId } });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "no user found in this id",
      });
      
    }
    const updatedUser = await prisma.users.update({
      where: { id: +req.userId },
      data: {
        role: req.body.role,
      },
    });

    res.status(200).json(updatedUser);
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    const user = await prisma.users.findFirst({ where: { id: +req.userId } });
    if (!user) {
      return res.status(403).json({
        success: false,
        message:  "no user found in this id",
      });
     
    }
    const deletedUser = await prisma.users.delete({
      where: { id: +req.userId },
    });
    return res.status(200).json({
      message: "sucessfully deleted",
      sucess: true,
    });
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    const roleQuery = req?.query?.role;
    console.log(roleQuery);

    let employee;

    if (roleQuery) {
      console.log("here");
      // fetch with the specified role query
      employee = await prisma.users.findMany({
        where: {
          NOT: { role: "MOTHER" },
          AND: { role: roleQuery as any },
        },
        include: {
          profile: true,
          proProfile: true,
        },
      });
      if (!employee) {
        return res.status(403).json({
          success: false,
          message:   "no employee found in this id",
        });
      }
      return res.status(200).json(employee);
    } else {
      // fetch all except mother
      employee = await prisma.users.findMany({
        where: {
          NOT: { role: "MOTHER" },
        },
        include: {
          profile: true,
          proProfile: true,
        },
      });
      if (!employee) {
        return res.status(403).json({
          success: false,
          message:  "no employee found in this id",
        });
      }
      return res.status(200).json(employee);
    }
  },
  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    // req.userId = +req.params.id;
    const user = await prisma.users.findFirst({
      where: { id },
      include: {
        profile: true,
        proProfile: true,
      },
    });
    if (!user) {
      return res.status(403).json({
        success: false,
        message:  "no user found in this id",
      });
      
    }
    return res.status(200).json(user);
  },
  getByHs: async (req: Request, res: Response, next: NextFunction) => {
    req.hsId = +req.params.id;
    const employee = await prisma.users.findMany({
      where: {
        AND: [
          { healthStationId: +req.hsId },
          {
            NOT: {
              role: "MOTHER",
            },
          },
        ],
      },
    });
    res.status(200).json(employee);
  },
};

export default employeeController;
