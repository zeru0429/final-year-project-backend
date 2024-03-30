import { z } from "zod";

const notificationSchema ={
    //register child
    register: z.object({
      userId: z.number(),
       message : z.string(),
   }),
   update: z.object({
      userId: z.number(),
       message : z.string(),
   }),

}

export default notificationSchema;