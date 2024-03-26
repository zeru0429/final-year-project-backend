 import {z} from 'zod'


const authSchema = {
   //register admin
   registerAdmin: z.object({
      email: z.string().email(),
      phone: z.string().max(14),
      password: z.string().min(8).max(20),
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      imageUrl: z.string(),
      
   }),
   //signup schema
   signup: z.object({
      email:z.string().email(),
      password:z.string().min(6),
      firstName:z.string(),
      lastName:z.string(),
      middleName:z.string().optional()
      
   }),
   //login schema
   login: z.object({
      email:z.string().email(),
      password:z.string()
      
   })
}
export default authSchema;

