import { string, z } from "zod";

const hsSchema ={
    register: z.object({
      name: z.string(),
      type: z.enum([
         'GENERAL_HOSPITAL',
         'CLINIC',
         'HEALTH_CENTER',
         'SPECIALTY_HOSPITAL',
         'REHABILITATION_CENTER',
         'DIAGNOSTIC_CENTER',
         'MATERNITY_HOSPITAL',
         'PSYCHIATRIC_HOSPITAL',
         'MEDICAL_LABORATORY',
         'PHARMACY',
         'PEDIATRIC_CLINIC',
         'SPORTS_MEDICINE_CLINIC',
         'CHIROPRACTIC_CLINIC',
         'VETERINARY_CLINIC'
      ]),
      city: z.string(),
      subcity: z.string(),
      kebele: z.string(),
      houseNumber: z.string(),
   }),
   

}

export default hsSchema;