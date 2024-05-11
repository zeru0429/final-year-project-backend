import { NextFunction, Request, Response } from "express";
import hsSchema from "./hsSchema.js";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";

const hsController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    //  console.log(req.body);
    hsSchema.register.parse(req.body);
    const { name, email, type, city, subcity, kebele, houseNumber, imageUrl } =
      req.body;
    console.log(req.body);
    //check if the hs exist before
    const hs = await prisma.healthStations.findFirst({
      where: {
        email: req.body.email,
      },
    });
    console.log(hs);

    if (hs) {
      return next(
        new UnprocessableEntity(
          "health station is already registered",
          403,
          ErrorCode.USER_ALREADY_EXIST,
          null
        )
      );
    }

    // create  a new health station

    console.log(req.body.admin);
    req.body.registeredBy = req.body.admin.id;
    const newHs = await prisma.healthStations.create({
      data: {
        registeredBy: req.body.admin.id,
        name,
        email,
        type,
        city,
        subcity,
        kebele,
        houseNumber,
        imageUrl,
      },
    });
    return res.status(201).json({
      status: "success",
      data: newHs,
    });
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    console.log(id);
    console.log("update");
    // req.hsId = +req.params.id;
    hsSchema.register.parse(req.body);
    //check if the hs exist before
    const hs = await prisma.healthStations.findUnique({
      where: {
        id: Number(id),
      },
    });
    console.log(hs);

    if (!hs) {
      return next(
        new UnprocessableEntity(
          "health station is is not found",
          403,
          ErrorCode.HS_NOT_FOUND,
          null
        )
      );
    }

    const updatedHs = await prisma.healthStations.update({
      where: {
        id: Number(id),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        city: req.body.city,
        subcity: req.body.subcity,
        kebele: req.body.kebele,
        houseNumber: req.body.houseNumber,
        imageUrl: req.body.imageUrl,
      },
    });

    if (!updatedHs) {
      return next(
        new UnprocessableEntity(
          "No fields were changed",
          400,
          ErrorCode.NO_FIELDS_CHANGED,
          null
        )
      );
    }

    return res.status(201).json(updatedHs);
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    // req.hsId = +req.params.id;
    //check if the hs exist before
    const hs = await prisma.healthStations.findUnique({
      where: {
        id,
      },
    });
    if (!hs) {
      return next(
        new UnprocessableEntity(
          "health station is is not found",
          403,
          ErrorCode.HS_NOT_FOUND,
          null
        )
      );
    }

    //delete the hsInfo
    const deleteHs = await prisma.healthStations.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      status: "success",
      message: "deleted successfully",
    });
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    //get hs
    const hs = await prisma.healthStations.findMany({
      // skip: +req.query.skip!,
      // take: +req.query.take!,
      // include: {
      //   _count: true,
      //   childVaccine: {
      //     include: {},
      //   },
      // },
    });
    console.log(hs);
    return res.status(200).json(hs);
  },
  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    req.hsId = +req.params.id;
    //get hs
    const hs = await prisma.healthStations.findFirstOrThrow({
      include: {
        info: true,
      },
      where: {
        id: +req.hsId,
      },
    });
    res.status(200).json(hs);
  },
};
export default hsController;
