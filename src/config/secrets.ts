import dotenv from 'dotenv'
dotenv.config({
   path: '.env'
})

export const PORT = process.env.PORT
export const HOST = process.env.HOST
export const SECRET = process.env.JWT_SECRET
export const DATABASE_URL = process.env.DATABASE_URL
export const CORS_ORIGIN =process.env.CORS_ORIGIN
