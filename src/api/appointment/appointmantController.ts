import { NextFunction, Request, Response } from "express";
import certificationSchema from "./appointmantSchema.js";
import { prisma } from "../../config/prisma.js";
import { ErrorCode } from "../../exceptions/root.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import appointmantSchema from "./appointmantSchema.js";

const appointmantController = {
  newAppointments: async (req: Request, res: Response, next: NextFunction) => {
    appointmantSchema.register.parse(req.body);
    //start store
    const newAppointments = await prisma.appointments.create({
      data: {
        appointmentDate: new Date(req.body.appointmentDate),
        childId: +req.body.childId,
        healthStationId: +req.body.healthStationId,
        motherId: +req.body.motherId,
        description: req.body.description,
        registerdBy: req.user!.id,
        vaccineId: +req.body.vaccineId,
        createdDateTime: new Date(),
      },
    });
    return res.status(200).json(newAppointments);
  },
  updateAppointments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.appId = +req.params.id;
    //check if the appointment exist
    const appointment = await prisma.appointments.findFirst({
      where: {
        id: +req.appId,
      },
    });
    if (!appointment) {
      return res.status(403).json({
      success: false,
      message: "This appointment not found",
    });
    }
    //start update
    const updateAppointments = await prisma.appointments.update({
      where: {
        id: +req.appId,
      },
      data: {
        description: req.body.description,
        healthStationId: +req.body.healthStationId,
        childId: +req.body.childId,
        motherId: +req.body.motherId,
        appointmentDate: new Date(req.body.appointmentDate),
        registerdBy: req.user?.id,
      },
    });
    return res.status(200).json(updateAppointments);
  },
  deleteAppointments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.appId = +req.params.id;
    //check if the appointment exist
    const appointment = await prisma.appointments.findFirst({
      where: {
        id: +req.appId,
      },
    });
    if (!appointment) {
      return res.status(403).json({
        success: false,
        message: "This appointment not found",
      });
     
    }
    //start deleting
    const deleteAppointments = await prisma.appointments.delete({
      where: {
        id: +req.appId,
      },
    });
    return res.status(200).json({
      message: "appointment deleted successfully",
      sucess: true,
    });
  },
  getSingleAppointments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.appId = +req.params.id;
    //check if the appointment exist
    const appointment = await prisma.appointments.findFirst({
      where: {
        id: +req.appId,
      },
    });
    if (!appointment) {
      return res.status(403).json({
        success: false,
        message: "This appointment not found",
      });
     
    }
    return res.status(200).json(appointment);
  },
  getAllAppointments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //check if the appointment exist
    const appointment = await prisma.appointments.findMany();
    if (!appointment) {
      return res.status(403).json({
        success: false,
        message: "This appointment not found",
      });
     
    }
    return res.status(200).json(appointment);
  },
  getAppointmentsByHs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.hsId = +req.params.id;
    //check if the hs exist
    const hs = await prisma.healthStations.findFirst({
      where: {
        id: +req.hsId,
      },
    });
    if (!hs) {
      return res.status(403).json({
        success: false,
        message: "This appointment not found",
      });
      
    }
    // get all Appointmentss in that hs
    const Appointmentss = await prisma.appointments.findMany({
      where: {
        healthStationId: +req.hsId,
      },
    });
    return res.status(200).json(Appointmentss);
  },
  getAppointmentsByChildId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.childId = +req.params.id;
    //check if the child exist
    const child = await prisma.childrens.findFirst({
      where: {
        id: +req.childId,
      },
    });
    if (!child) {
      return res.status(403).json({
        success: false,
        message: "This child not found",
      });
     
    }
    // get all Appointmentss in that child
    const Appointmentss = await prisma.appointments.findFirst({
      where: {
        childId: +req.childId,
      },
    });
    return res.status(200).json(Appointmentss);
  },
  getAppointmentsByMotherId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.mId = +req.params.id;
    //check if the mother exist
    const mother = await prisma.mothersProfile.findFirst({
      where: {
        id: +req.mId,
      },
    });
    if (!mother) {
      return res.status(403).json({
        success: false,
        message: "This mother not found",
      });
     
    }
    // get all Appointmentss in that mother
    const Appointmentss = await prisma.appointments.findMany({
      where: {
        motherId: +req.mId,
      },
    });
    return res.status(200).json(Appointmentss);
  },
};
export default appointmantController;
