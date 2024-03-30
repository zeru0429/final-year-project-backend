import { z } from "zod";

const certificationSchema ={
    //register child
    register: z.object({
      healthStationId: z.number(),
      childId: z.number(),
      name: z.string(),
   }),
   update: z.object({
      healthStationId: z.number(),
      childId: z.number(),
      name: z.string(),
   }),

}

export default certificationSchema;