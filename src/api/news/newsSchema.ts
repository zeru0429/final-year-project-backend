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
   updateNews: z.object({
      titleAm: z.string(),
      titleOr: z.string(),
      descriptionAm: z.string(),
      descriptionOr: z.string(),
   }),
};

export default newsSchema;
