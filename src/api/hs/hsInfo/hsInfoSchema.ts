import { string, z } from "zod";

const hsInfoSchema ={
    register: z.object({
      healthStationId: z.number(),
      serviceAm: z.string(),
      serviceOr: z.string(),
      descriptionAm: z.string(), 
      descriptionOr: z.string(), 
   }),
   

}

export default hsInfoSchema;