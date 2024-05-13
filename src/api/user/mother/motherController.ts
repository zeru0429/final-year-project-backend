import { NextFunction, Request, Response } from "express";
import userSchema from "../userSchema.js";
import { prisma } from "../../../config/prisma.js";
import { UnprocessableEntity } from "../../../exceptions/validation.js";
import { ErrorCode } from "../../../exceptions/root.js";
import bcrypt from "bcrypt";
import { inflateRaw } from "zlib";

const motherController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // attach the health station id to the request body
    req.body.healthStationId = req.user?.healthStationId;

    userSchema.registerMother.parse(req.body);
    //check if the employye exist before
    const isMotherExist = await prisma.users.findFirst({
      where: {
        OR: [{ email: req.body.email }, { phone: req.body.phone }],
      },
    });
    if (isMotherExist) {
      return res.status(403).json({
        success: false,
        message: "Email or Phone has been registered before",
      });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    //create the employee
    const newMother = await prisma.users.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        role: "MOTHER",
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
        motherProfile: {
          create: {
            birthdate: new Date(req.body.birthdate),
            bloodType: req.body.bloodType,
            RH: req.body.RH,
          },
        },
      },
      include: {
        profile: true,
        motherProfile: true,
      },
    });
    return res.status(201).json(newMother);
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    req.mId = +req.params.id;
    userSchema.updateMother.parse(req.body);
    const isMother = await prisma.users.findFirst({
      where: {
        AND: [{ id: +req.mId }, { role: "MOTHER" }],
      },
    });
    if (!isMother) {
      return res.status(403).json({
        success: false,
        message: "no mother found in this id",
      });
    }
    //update the user info
    const updatedMother = await prisma.users.update({
      where: {
        id: +req.mId,
      },
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
        motherProfile: {
          update: {
            birthdate: new Date(req.body.birthdate),
            bloodType: req.body.bloodType,
          },
        },
      },
    });
    return res.status(200).json(updatedMother);
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    req.mId = +req.params.id;
    userSchema.updateMother.parse(req.body);
    const isMother = await prisma.users.findFirst({
      where: {
        AND: [{ id: +req.mId }, { role: "MOTHER" }],
      },
    });
    if (!isMother) {
      return res.status(403).json({
        success: false,
        message: "no mother found in this id",
      });
    }
    //start deleting
    const isDeleted = await prisma.users.delete({
      where: {
        id: +req.mId,
      },
    });
    return res.status(200).json({
      message: "sucessfully deleted",
      sucess: true,
    });
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    console.log("hhhh");
    const mothers = await prisma.users.findMany({
      where: { role: "MOTHER" },
    });
    if (!mothers) {
      return res.status(403).json({
        success: false,
        message: "no mother found",
      });
    }
    return res.status(200).json(mothers);
  },
  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    req.mId = +req.params.id;
    const isMother = await prisma.users.findFirst({
      where: {
        AND: [{ id: +req.mId }, { role: "MOTHER" }],
      },
    });
    if (!isMother) {
      return res.status(403).json({
        success: false,
        message: "no mother found in this id",
      });
    }
    return res.status(200).json(isMother);
  },
  getByHs: async (req: Request, res: Response, next: NextFunction) => {
    req.hsId = +req.params.id;
    const allMothers = await prisma.users.findMany({
      where: {
        AND: [{ role: "MOTHER" }, { healthStationId: +req.hsId }],
      },
    });
    return res.status(200).json(allMothers);
  },
  getByMyHs: async (req: Request, res: Response, next: NextFunction) => {
    console.log("hello");

    const hsId = req?.user?.healthStationId;
    //  req.hsId = +req.user!.healthStationId!;

    const allMothers = await prisma.users.findMany({
      // orderBy: {
      //   id: "desc",
      // },
      // skip: +req.query.skip!,
      // take: +req.query.take!,
      where: {
        AND: [{ role: "MOTHER" }, { healthStationId: hsId }],
      },
      include: {
        //   _count: true,
        profile: true,
        appointment: true,
        certifications: true,
        child: true,
        motherVaccine: true,
        childVaccine: true,
        //   healthStation: true,
      },
    });
    return res.status(200).json(allMothers);
  },
};

export default motherController;
