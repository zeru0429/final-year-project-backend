 import {z} from 'zod'


const authSchema = {
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

