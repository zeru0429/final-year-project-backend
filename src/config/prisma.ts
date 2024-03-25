import { PrismaClient } from "@prisma/client";
import authSchema from "../schema/auth.js";

export const prisma = new PrismaClient({
   log: ['query']
})