import { number, z } from "zod";

// const motherVaccineSchema = {
//   //register user
//   register: z.object({
//     motherId: z.number(),
//     vaccineId: z.number(),
//     healthStationId: z.number(),
//     isGiven: z.boolean(),
//   }),

//   update: z.object({
//     motherId: z.number(),
//     vaccineId: z.number(),
//     healthStationId: z.number(),
//     isGiven: z.boolean(),
//   }),
// };

const childVaccineSchema = {
  //register user
  register: z.object({
    childId: z.number(),
    vaccineId: z.number(),
    healthStationId: z.number(),
    isGiven: z.boolean(),
  }),

  update: z.object({
    childId: z.number(),
    vaccineId: z.number(),
    healthStationId: z.number(),
    isGiven: z.boolean(),
  }),
};
export default childVaccineSchema;
