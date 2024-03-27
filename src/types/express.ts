import express from 'express'
import {Admins, News, Users} from  '@prisma/client'

declare module 'express'{
   export interface Request {
      admin?: Admins
   }
}
declare module 'express'{
   export interface Request {
      user?: Users
      registeredBy: Number
   }
}

declare module 'express'{
   export interface Request {
      news?: News
      newsId: Number
   }
}