import { NextFunction, Request, Response } from "express";
import childSchema from "./childSchema.js";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";

const childController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    //  childSchema.registerChild.parse(req.body);
    //check if mother exist
    const isMotherExist = await prisma.mothersProfile.findFirst({
      where: { id: req.body.motherId },
    });
    if (!isMotherExist) {
      return next(
        new UnprocessableEntity(
          "no mother found in this id",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    // start rgistering
    const newchild = await prisma.childrens.create({
      data: {
        isVaccineCompleted: false,
        birthdate: new Date(req.body.birthdate),
        bloodType: req.body.bloodType,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        motherId: req.body.motherId,
        createdAt: new Date(),
        registeredBy: req?.user?.id,
      },
    });
    return res.status(200).json(newchild);
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    req.childId = +req.params.id;
    childSchema.updateChild.parse(req.body);
    const isChildExist = await prisma.childrens.findFirst({
      where: { id: +req.childId },
    });
    if (!isChildExist) {
      return next(
        new UnprocessableEntity(
          "Child not found",
          404,
          ErrorCode.CHILD_NOT_FOUND,
          null
        )
      );
    }
    const updatedChild = await prisma.childrens.update({
      where: {
        id: +req.childId,
      },
      data: {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        birthdate: new Date(req.body.birthdate),
        bloodType: req.body.bloodType,
      },
    });
    res.status(200).json(updatedChild);
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    req.childId = +req.params.id;
    const isChildExist = await prisma.childrens.findFirst({
      where: { id: +req.childId },
    });
    if (!isChildExist) {
      return next(
        new UnprocessableEntity(
          "Child not found",
          404,
          ErrorCode.CHILD_NOT_FOUND,
          null
        )
      );
    }
    const deletedChild = await prisma.childrens.delete({
      where: { id: +req.childId },
    });
    res.status(200).json({
      message: "sucessfully deleted",
      sucess: true,
    });
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    const children = await prisma.childrens.findMany({
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,

        isVaccineCompleted: true,
        mother: {
          select: {
            id: true,
            user: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    middleName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!children)
      return next(
        new UnprocessableEntity(
          "no children found",
          404,
          ErrorCode.CHILD_NOT_FOUND,
          null
        )
      );
    return res.status(200).json(children);
  },
  getAllByMother: async (req: Request, res: Response, next: NextFunction) => {
    req.mId = +req.params.id;
    //check if mother exist
    const isMotherExist = await prisma.mothersProfile.findFirst({
      where: {
        id: +req.mId,
      },
    });
    if (!isMotherExist) {
      return next(
        new UnprocessableEntity(
          "no mother found in this id",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    const isChildExist = await prisma.childrens.findMany({
      where: {
        motherId: +req.mId,
      },
    });
    res.status(200).json(isChildExist);
  },
  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    req.childId = +req.params.id;
    const isChildExist = await prisma.childrens.findFirst({
      where: { id: +req.childId },
    });
    if (!isChildExist) {
      return next(
        new UnprocessableEntity(
          "Child not found",
          404,
          ErrorCode.CHILD_NOT_FOUND,
          null
        )
      );
    }
    res.status(200).json(isChildExist);
  },
  getByHs: async (req: Request, res: Response, next: NextFunction) => {
    req.hsId = +req.params.id;
    const isHsExist = await prisma.healthStations.findFirstOrThrow({
      where: {
        id: +req.hsId,
      },
    });
    if (!isHsExist) {
      return next(
        new UnprocessableEntity(
          "health station is is not found",
          403,
          ErrorCode.HS_NOT_FOUND,
          null
        )
      );
    }
    const isChildExist = await prisma.childrens.findMany({
      where: {
        mother: {
          user: {
            healthStationId: +req.hsId,
          },
        },
      },
    });
    res.status(200).json(isChildExist);
  },
};

export default childController;
