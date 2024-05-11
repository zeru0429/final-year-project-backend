import { z } from "zod";

const vaccineSchema = {
  //register user
  register: z.object({
    name: z.string(),
    category: z.string(),
    dose: z.number(),
    duration: z.number(),
    description: z.string().optional(),
    ageRange: z.string(),
  }),
};
export default vaccineSchema;
