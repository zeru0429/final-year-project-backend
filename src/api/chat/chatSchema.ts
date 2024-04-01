import { z } from "zod";

const chatSchema = {
  // Register child
  createGroup: z.object({
    name: z.string(), // Assuming name is a string
    participants: z.array(z.number()), // Assuming participants is an array of numbers
  }),
};

export default chatSchema;
