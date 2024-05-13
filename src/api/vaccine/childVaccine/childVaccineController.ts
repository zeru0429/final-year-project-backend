import { NextFunction, Request, Response } from "express";
import childVaccineSchema from "./childVaccineSchema.js";
import { prisma } from "../../../config/prisma.js";
import { UnprocessableEntity } from "../../../exceptions/validation.js";
import { ErrorCode } from "../../../exceptions/root.js";

const vaccinateChildController = {
  vaccinate: async (req: Request, res: Response, next: NextFunction) => {
    childVaccineSchema.register.parse(req.body);
    //check if the vaccine exist with this id
    const isVaccineExist = await prisma.vaccines.findFirst({
      where: {
        id: +req.body!.vaccineId,
      },
    });
    if (!isVaccineExist) {
      return res.status(403).json({
        success: false,
        message: "no vaccine found in this id",
      });
    }
    //check if child exist
    const isChildExist = await prisma.childrens.findFirst({
      where: {
        id: +req.body!.childId,
      },
    });
    if (!isChildExist) {
      return res.status(403).json({
        success: false,
        message: "no child found in this id",
      });
    }

    const childVaccine = await prisma.childrenVaccines.create({
      data: {
        createdDateTime: new Date(),
        isGiven: true,
        childId: +req.body!.childId,
        vaccineId: +req.body!.vaccineId,
      },
    });

    return res.status(200).json(childVaccine);
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    req.cvId = +req.params.id;
    childVaccineSchema.update.parse(req.body);
    //check if the vaccine exist with this id
    const isChildVaccineExist = await prisma.childrenVaccines.findFirst({
      where: {
        id: +req.cvId,
      },
    });
    if (!isChildVaccineExist) {
      return res.status(403).json({
        success: false,
        message: "no vaccine found in this id",
      });
    }

    const isVaccineExist = await prisma.vaccines.findFirst({
      where: {
        id: +req.body!.vaccineId,
      },
    });
    if (!isVaccineExist) {
      return res.status(403).json({
        success: false,
        message: "no vaccine found in this id",
      });
    }
    //check if child exist
    const isChildExist = await prisma.childrens.findFirst({
      where: {
        id: +req.body!.childId,
      },
    });
    if (!isChildExist) {
      return res.status(403).json({
        success: false,
        message: "no child found in this id",
      });
    }

    const childVaccine = await prisma.childrenVaccines.update({
      data: {
        createdDateTime: new Date(),
        isGiven: req.body.isGiven,
        childId: +req.body!.childId,
        vaccineId: +req.body!.vaccineId,
      },
      where: {
        id: +req.cvId,
      },
    });

    return res.status(200).json(childVaccine);
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    req.cvId = +req.params.id;
    //check if the vaccine exist with this id
    const isChildVaccineExist = await prisma.childrenVaccines.findFirst({
      where: {
        id: +req.cvId,
      },
    });
    if (!isChildVaccineExist) {
      return res.status(403).json({
        success: false,
        message: "no child found in this id",
      });
    }

    const childVaccine = await prisma.childrenVaccines.delete({
      where: {
        id: +req.cvId,
      },
    });
    return res.status(200).json({
      message: "sucessfully deleted",
      sucess: true,
    });
  },
  getAllByChildId: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const childVaccine = await prisma.childrenVaccines.findMany({
      where: {
        childId: id,
      },
      include: {
        vaccine: {
          select: {
            name: true,
          },
        },
        healthStation: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json(childVaccine);
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const childVaccine = await prisma.childrenVaccines.findMany();
      return res.status(200).json(childVaccine);
    } catch (error) {
      next(error);
    }
  },
  getAllByChildVaccineId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.cvId = +req.params.id;
    const childVaccine = await prisma.childrenVaccines.findMany({
      where: {
        id: +req.cvId,
      },
    });
    return res.status(200).json(childVaccine);
  },

  getChildrenVaccByMotherId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const motherId = Number(req.params.id);

    const childVaccine = await prisma.childrenVaccines.findMany({
      where: {
        child: {
          motherId: motherId,
        },
      },
      include: {
        healthStation: {
          select: {
            name: true,
          },
        },
        vaccine: {
          select: {
            name: true,
          },
        },
        child: {
          select: {
            firstName: true,
            middleName: true,
          },
        },
      },
    });
    return res.status(200).json(childVaccine);
  },
};

export default vaccinateChildController;
