import { PrismaClient } from "@prisma/client";
import authSchema from "../api/admin/authSchema.js";

export const prisma = new PrismaClient({
   // log: ['query']
})