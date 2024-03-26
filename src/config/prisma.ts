import { PrismaClient } from "@prisma/client";
import authSchema from "../schema/authSchema.js";

export const prisma = new PrismaClient({
   log: ['query']
})