import { z } from "zod";

const childSchema ={
    //register child
    registerChild: z.object({
      healthStationId: z.number(),
      motherId: z.number(),
     //profile
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      sex: z.enum(['MALE', 'FEMALE']),
      //manager, reception and hp related
      birthdate: z.string(),
      bloodType: z.string(),      
   }),
   updateChild: z.object({
      healthStationId: z.number(),
      motherId: z.number(),
     //profile
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      sex: z.enum(['MALE', 'FEMALE']),
      //manager, reception and hp related
      birthdate: z.string(),
      bloodType: z.string(),      
   }),

}

export default childSchema;