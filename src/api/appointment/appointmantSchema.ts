import { z } from "zod";

const appointmantSchema ={
    //register child
    register: z.object({
      healthStationId: z.number(),
      childId: z.number(),
      motherId: z.number(),
      vaccineId: z.number(),
      name: z.string(),
      appointmentDate: z.string(),
      description: z.string().optional(),

   }),
   update: z.object({
      healthStationId: z.number(),
      childId: z.number(),
      motherId: z.number(),
      vaccineId: z.number(),
      name: z.string(),
      appointmentDate: z.string(),
      description: z.string().optional(),
   }),

}

export default appointmantSchema;