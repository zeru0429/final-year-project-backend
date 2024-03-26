import { z } from 'zod';

const newsSchema = {
   //register admin
   createNews: z.object({
      titleAm: z.string(),
      titleOr: z.string(),
      descriptionAm: z.string(),
      descriptionOr: z.string(),
      images: z.array(z.string()).nullable(),
   }),
};

export default newsSchema;
